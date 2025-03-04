import { definedCustomElements } from '../elements';
import { DropdownElement } from '../elements/dropdown';
import { MessageElement } from '../elements/message';
import { ModelElement } from '../elements/model';
import { cors } from '../interfaces/cors';
import { Script } from '../interfaces/script';
import { $ } from '../utils/common';
import { $const } from '../utils/const';
import { $creator } from '../utils/creator';
import { el, enableElementDraggable } from '../utils/dom';
import { $elements } from '../utils/elements';
import { StartConfig } from '../utils/start';
import { $store } from '../utils/store';
import { $gm } from '../utils/tampermonkey';
import debounce from 'lodash/debounce';

export type ModelAttrs = Pick<
	ModelElement,
	| 'content'
	| 'onConfirm'
	| 'onCancel'
	| 'onClose'
	| 'cancelButtonText'
	| 'confirmButtonText'
	| 'placeholder'
	| 'width'
	| 'cancelButton'
	| 'confirmButton'
	| 'inputDefaultValue'
	| 'profile'
> & {
	/** 取消生成窗口的关闭按钮 */
	disableWrapperCloseable?: boolean;
	/** 弹窗标题 */
	title?: ModelElement['title'];
	/** 伴随系统通知一起弹出 */
	notification?: boolean;
	notificationOptions?: {
		/** 是否为重要通知 */
		important?: boolean;
		/** 消息显示时间（秒） */
		duration?: number;
	};
};

const minimizeSvg =
	'<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg>';
const expandSvg =
	'<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z"/></svg>';

/**
 * 内置的渲染脚本，包含在内置的 RenderProject 类中。搭配 start 函数进行整个脚本的悬浮窗构成创建
 *
 * 可以不用悬浮窗也能执行脚本的生命周期，但是不会执行 render 这个生命周期
 */
export const RenderScript = new Script({
	name: '🖼️ 窗口设置',
	url: [['所有', /.*/]],
	namespace: 'render.panel',
	configs: {
		notes: {
			defaultValue: $creator.notes([
				['如果需要隐藏整个窗口，可以点击下方隐藏按钮，', '隐藏后可以快速三击屏幕中的任意地方', '来重新显示窗口。'],
				'窗口连续点击显示的次数可以自定义，默认为三次'
			]).outerHTML
		},
		x: { defaultValue: window.innerWidth * 0.1 },
		y: { defaultValue: window.innerWidth * 0.1 },

		/**
		 * - minimize: 最小化
		 * - close: 关闭
		 * - normal: 正常
		 */
		visual: { defaultValue: 'normal' as 'minimize' | 'normal' | 'close' },
		// 首次关闭时警告
		firstCloseAlert: {
			defaultValue: true
		},
		fontsize: {
			label: '字体大小（像素）',
			attrs: { type: 'number', min: 12, max: 24, step: 1 },
			defaultValue: 14
		},
		switchPoint: {
			label: '窗口显示连点（次数）',
			attrs: {
				type: 'number',
				min: 3,
				max: 10,
				step: 1,
				title: '设置当连续点击屏幕 N 次时，可以进行面板的 隐藏/显示 切换，默认连续点击屏幕三下'
			},
			defaultValue: 3
		}
	},
	onrender({ panel }) {
		const closeBtn = el('button', { className: 'base-style-button' }, '隐藏窗口');
		closeBtn.onclick = () => {
			if (this.cfg.firstCloseAlert) {
				$model('confirm', {
					content: $creator.notes([
						'隐藏脚本页面后，快速点击页面三下（可以在悬浮窗设置中调整次数）即可重新显示脚本。如果三下无效，可以尝试删除脚本重新安装。',
						'请确认是否关闭。（此后不再显示此弹窗）'
					]),
					onConfirm: () => {
						this.cfg.visual = 'close';
						this.cfg.firstCloseAlert = false;
					}
				});
			} else {
				this.cfg.visual = 'close';
			}
		};

		panel.body.replaceChildren(el('hr'), closeBtn);
	},

	async onactive({ style, projects }: StartConfig) {
		/** 兼容低版本浏览器 */
		handleLowLevelBrowser();

		/** 加载自定义元素 */
		$.loadCustomElements(definedCustomElements);

		/** 当前匹配到的脚本，并且面板不隐藏 */
		const matchedScripts = $.getMatchedScripts(projects, [location.href]).filter((s) => !s.hideInPanel);

		/** 根元素 */
		const container = el('container-element');

		/** 创建头部元素 */
		const initHeader = (urls: string[], currentPanelName: string) => {
			const infos = $gm.getInfos();

			/** 版本  */
			const profile = $creator.tooltip(
				el(
					'div',
					{ className: 'profile', title: '菜单栏（可拖动区域）' },
					`OCS${infos ? '-' : ''}${infos?.script.version || ''}`
				)
			);

			const scriptDropdowns: DropdownElement[] = [];

			for (const project of projects) {
				const dropdown = el('dropdown-element');

				let selected = false;

				const options: HTMLOptionElement[] = [];

				// 如果整个工程下面有一个需要显示的脚本，那此工程就添加到头部
				const scripts = $.getMatchedScripts([project], urls).filter((s) => !s.hideInPanel);

				if (scripts.length) {
					for (const key in project.scripts) {
						if (Object.prototype.hasOwnProperty.call(project.scripts, key)) {
							const script = project.scripts[key];
							// 只显示需要显示的面板
							if (!script.hideInPanel) {
								const optionSelected = isCurrentPanel(project.name, script, currentPanelName);
								const option = el('option', {
									value: project.name + '-' + script.name,
									label: script.name
								});

								if (optionSelected) {
									option.classList.add('active');
								}

								if (selected !== true && optionSelected) {
									selected = true;
								}

								option.onclick = () => {
									$store.setTab($const.TAB_CURRENT_PANEL_NAME, project.name + '-' + script.name);
								};

								options.push(option);
							}
						}
					}

					if (selected) {
						dropdown.classList.add('active');
					}

					dropdown.triggerElement = el('div', { className: 'dropdown-trigger-element ' }, project.name);
					dropdown.triggerElement.style.padding = '0px 8px';
					dropdown.content.append(...options);

					scriptDropdowns.push(dropdown);
				}
			}

			/** 窗口是否最小化 */
			const isMinimize = () => this.cfg.visual === 'minimize';
			/** 窗口状态切换按钮 */
			const visualSwitcher = $creator.tooltip(
				el('div', {
					className: 'switch ',
					title: isMinimize() ? '点击展开窗口' : '点击最小化窗口',
					innerHTML: isMinimize() ? expandSvg : minimizeSvg,
					onclick: () => {
						this.cfg.visual = isMinimize() ? 'normal' : 'minimize';
						visualSwitcher.title = isMinimize() ? '点击展开窗口' : '点击最小化窗口';
						visualSwitcher.innerHTML = isMinimize() ? expandSvg : minimizeSvg;
					}
				})
			);
			container.header.visualSwitcher = visualSwitcher;

			container.header.replaceChildren();
			container.header.append(profile, ...scriptDropdowns, container.header.visualSwitcher || '');
		};

		/** 处理面板位置 */
		const handlePosition = () => {
			if (this.cfg.x > document.documentElement.clientWidth || this.cfg.x < 0) {
				this.cfg.x = 10;
				this.cfg.y = 10;
			}

			if (this.cfg.y > document.documentElement.clientHeight || this.cfg.y < 0) {
				this.cfg.x = 10;
				this.cfg.y = 10;
			}

			container.style.left = this.cfg.x + 'px';
			container.style.top = this.cfg.y + 'px';
			const positionHandler = () => {
				this.cfg.x = container.offsetLeft;
				this.cfg.y = container.offsetTop;
			};
			enableElementDraggable(container.header, container, positionHandler);

			this.onConfigChange(
				'x',
				debounce((x) => (container.style.left = x + 'px'), 200)
			);
			this.onConfigChange(
				'y',
				debounce((y) => (container.style.top = y + 'px'), 200)
			);
		};

		/** 切换面板状态 */
		const visual = (value: string) => {
			container.className = '';
			// 最小化
			if (value === 'minimize') {
				container.classList.add('minimize');
			}
			// 关闭
			else if (value === 'close') {
				container.classList.add('close');
			}
			// 展开
			else {
				container.classList.add('normal');
			}
		};

		/** 处理面板可视状态 */
		const handleVisible = () => {
			window.addEventListener('click', (e) => {
				// 三击以上重置位置
				if (e.detail === Math.max(this.cfg.switchPoint, 3)) {
					container.style.top = e.y + 'px';
					container.style.left = e.x + 'px';
					this.cfg.x = e.x;
					this.cfg.y = e.y;
					this.cfg.visual = 'normal';
				}
			});
			// 跨域监听状态切换
			this.onConfigChange('visual', (curr) => visual(curr));
			visual(this.cfg.visual);
		};

		/** 替换 body 中的内容 */
		const renderBody = async (currentPanelName: string) => {
			for (const project of projects) {
				for (const key in project.scripts) {
					if (Object.prototype.hasOwnProperty.call(project.scripts, key)) {
						const script = project.scripts[key];

						if (isCurrentPanel(project.name, script, currentPanelName)) {
							const panel = $creator.scriptPanel(script, { projectName: project.name });
							script.projectName = project.name;
							script.panel = panel;
							script.header = container.header;

							// 执行重新渲染钩子
							script.onrender?.({ panel: script.panel, header: container.header });
							script.emit('render', { panel: script.panel, header: container.header });

							container.body.replaceChildren(script.panel);
						}
					}
				}
			}
		};

		/** 初始化模态框系统 */
		const initModelSystem = () => {
			// 添加 models 监听队列
			cors.on('model', async ([type, _attrs]) => {
				return new Promise((resolve, reject) => {
					const attrs = _attrs as ModelAttrs;
					attrs.onCancel = () => resolve('');
					attrs.onConfirm = resolve;
					attrs.onClose = resolve;
					$model(type, attrs);
				});
			});
		};

		const onFontsizeChange = () => {
			container.style.font = `${this.cfg.fontsize}px  Menlo, Monaco, Consolas, 'Courier New', monospace`;
		};

		const rerender = async (urls: string[], currentPanelName: string) => {
			initHeader(urls, currentPanelName);
			await renderBody(currentPanelName);
		};

		/** 在顶级页面显示操作面板 */
		if (matchedScripts.length !== 0 && self === top) {
			/** 移除上一次加载页面时遗留下来的 url 加载数据 */
			$store.setTab($const.TAB_URLS, []);

			// 创建样式元素
			container.append(el('style', {}, style || ''), $elements.messageContainer);
			$elements.root.append(container);
			// 随机位置插入操作面板到页面
			document.body.children[$.random(0, document.body.children.length - 1)].after($elements.panel);

			// 首先处理窗口状态，防止下方的IO速度过慢可能导致窗口闪烁
			handleVisible();

			(async () => {
				const urls = await $store.getTab($const.TAB_URLS);
				const currentPanelName = await $store.getTab($const.TAB_CURRENT_PANEL_NAME);

				await rerender(defaults.urls(urls), defaults.panelName(currentPanelName));
			})();

			// 初始化模态框系统
			initModelSystem();
			// 处理面板位置
			handlePosition();
			onFontsizeChange();

			/** 使用 debounce 避免页面子 iframe 刷新过多 */
			$store.addTabChangeListener(
				$const.TAB_URLS,
				debounce(async (urls: string[]) => {
					const currentPanelName = await $store.getTab($const.TAB_CURRENT_PANEL_NAME);
					rerender(defaults.urls(urls), defaults.panelName(currentPanelName));
				}, 2000)
			);

			$store.addTabChangeListener($const.TAB_CURRENT_PANEL_NAME, async (currentPanelName) => {
				const urls = (await $store.getTab($const.TAB_URLS)) || [location.href];
				rerender(defaults.urls(urls), defaults.panelName(currentPanelName));
			});
			this.onConfigChange('fontsize', onFontsizeChange);
		}
	}
});

/** 默认值 */
const defaults = {
	/** 当前页面存在默认页面 */
	urls: (urls: string[]) => (urls && urls.length ? urls : [location.href]),
	/** 默认面板名 */
	panelName: (name: string) => name || RenderScript.namespace || ''
};

/**
 * 创建一个模态框代替原生的 alert, confirm, prompt
 */
export function $model(type: ModelElement['type'], attrs: ModelAttrs) {
	if (self === top) {
		const {
			disableWrapperCloseable,
			onConfirm,
			onCancel,
			onClose,
			notification: notify,
			notificationOptions,
			..._attrs
		} = attrs;

		if (notify) {
			$gm.notification(
				typeof _attrs.content === 'string' ? _attrs.content : _attrs.content.innerText,
				notificationOptions
			);
		}

		const wrapper = el('div', { className: 'model-wrapper' }, (wrapper) => {
			const model = el('model-element', {
				async onConfirm(val) {
					const isClose: any = await onConfirm?.apply(model, [val]);
					if (isClose !== false) {
						wrapper.remove();
					}

					return isClose;
				},
				onCancel() {
					onCancel?.apply(model);
					wrapper.remove();
				},
				onClose(val) {
					onClose?.apply(model, [val]);
					wrapper.remove();
				},
				type,
				..._attrs
			});
			wrapper.append(model);

			model.addEventListener('click', (e) => {
				e.stopPropagation();
			});
			if (!disableWrapperCloseable) {
				/** 点击遮罩层关闭模态框 */
				wrapper.addEventListener('click', () => {
					onClose?.apply(model);
					wrapper.remove();
				});
			}
		});

		$elements.root.append(wrapper);

		return wrapper;
	} else {
		cors.emit('model', [type, attrs], (args, remote) => {
			if (args) {
				attrs.onConfirm?.(args);
			} else {
				attrs.onCancel?.();
			}
		});
	}
}

/**
 * 消息推送
 */
export function $message(
	type: MessageElement['type'],
	attrs: Pick<MessageElement, 'duration' | 'onClose' | 'content' | 'closeable'>
) {
	const message = el('message-element', { type, ...attrs });
	$elements.messageContainer.append(message);
	return message;
}

/** 判断这个脚本是否为当前显示页面 */
function isCurrentPanel(projectName: string | undefined, script: Script, currentPanelName: string) {
	return projectName + '-' + script.name === currentPanelName || script.namespace === currentPanelName;
}

/** 兼容低版本浏览器 */
function handleLowLevelBrowser() {
	if (typeof Element.prototype.replaceChildren === 'undefined') {
		Element.prototype.replaceChildren = function (...nodes: (string | Node)[]) {
			this.innerHTML = '';
			for (const node of nodes) {
				this.append(node);
			}
		};
	}
}
