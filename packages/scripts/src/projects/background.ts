import { $, $creator, $gm, $model, $store, Project, Script, el, request } from '@ocsjs/core';
import gt from 'semver/functions/gt';
import { CommonProject } from './common';
import { definedProjects } from '..';

const state = {
	console: {
		listener: {
			logs: 0
		}
	}
};

export type LogType = 'log' | 'info' | 'debug' | 'warn' | 'error';

/** 后台进程，处理与PC软件端的通讯，以及其他后台操作 */
export const BackgroundProject = Project.create({
	name: '后台',
	domains: [],
	scripts: {
		console: new Script({
			name: '📄 日志输出',
			url: [['所有', /.*/]],
			namespace: 'render.console',
			configs: {
				logs: {
					defaultValue: [] as { type: LogType; content: string; time: number; stack: string }[]
				}
			},
			onrender({ panel }) {
				this.offConfigChange(state.console.listener.logs);

				const getTypeDesc = (type: LogType) =>
					type === 'info'
						? '信息'
						: type === 'error'
						? '错误'
						: type === 'warn'
						? '警告'
						: type === 'debug'
						? '调试'
						: '日志';

				const showLogs = () => {
					const div = el('div', { className: 'card console' });

					const logs = this.cfg.logs.map((log) => {
						const date = new Date(log.time);
						const item = el(
							'div',
							{
								title: '双击复制日志信息',
								className: 'item'
							},
							[
								el(
									'span',
									{ className: 'time' },
									`${date.getHours().toFixed(0).padStart(2, '0')}:${date.getMinutes().toFixed(0).padStart(2, '0')} `
								),
								el('span', { className: log.type }, `[${getTypeDesc(log.type)}]`),
								el('span', ':' + log.content)
							]
						);

						item.addEventListener('dblclick', () => {
							navigator.clipboard.writeText(
								Object.keys(log)
									.map((k) => `${k}: ${(log as any)[k]}`)
									.join('\n')
							);
						});

						return item;
					});
					if (logs.length) {
						div.replaceChildren(...logs);
					} else {
						div.replaceChildren(
							el('div', '暂无任何日志', (div) => {
								div.style.textAlign = 'center';
							})
						);
					}

					return { div, logs };
				};

				state.console.listener.logs =
					this.onConfigChange('logs', () => {
						const { div, logs } = showLogs();
						panel.body.replaceChildren(div);
						logs[logs.length - 1]?.scrollIntoView();
					}) || 0;

				const { div, logs } = showLogs();

				panel.body.replaceChildren(div);
				setTimeout(() => {
					logs[logs.length - 1]?.scrollIntoView();
				}, 100);
			}
		}),
		app: new Script({
			name: '🔄️ 软件配置同步',
			namespace: 'background.app',
			url: [['所有页面', /./]],
			level: -1,
			configs: {
				notes: {
					defaultValue: $creator.notes([
						[
							el('span', [
								'如果您使用',
								el('a', { href: 'https://docs.ocsjs.com/docs/app', target: '_blank' }, 'OCS桌面软件'),
								'启动浏览器，并使用此脚本，'
							]),
							'我们会同步软件中的配置到此脚本上，方便多个浏览器的管理。'
						],
						'如果不是，您可以忽略此脚本。'
					]).outerHTML
				},
				sync: {
					defaultValue: false
				},
				name: {
					defaultValue: ''
				}
			},
			onrender({ panel }) {
				const update = () => {
					if (this.cfg.sync) {
						const tip = el('div', { className: 'notes card' }, [`当前成功同步软件中 “${this.cfg.name}” 文件的配置.`]);
						panel.append(tip);
					}
				};
				update();
				this.onConfigChange('sync', update);
			},
			async oncomplete() {
				if ($.isInTopWindow()) {
					this.cfg.sync = false;
					try {
						const res = await request('https://ocs-app/browser', {
							type: 'fetch',
							method: 'get',
							responseType: 'json'
						});

						if (res.name && res.store) {
							for (const key in res.store) {
								if (Object.prototype.hasOwnProperty.call(res.store, key)) {
									$store.set(key, res.store[key]);
								}
							}

							this.cfg.name = res.name;
							this.cfg.sync = true;
						}
					} catch {
						//
					}
				}
			}
		}),
		dev: new Script({
			name: '🛠️ 开发者调试',
			namespace: 'background.dev',
			url: [['所有页面', /./]],
			configs: {
				notes: {
					defaultValue: '开发人员调试用。<br>注入OCS_CONTEXT全局变量。用户可忽略此页面。'
				}
			},
			onrender({ panel }) {
				const injectBtn = el('button', { className: 'base-style-button' }, '点击注入全局变量');
				injectBtn.addEventListener('click', () => {
					$gm.unsafeWindow.OCS_CONTEXT = self;
				});
				panel.body.replaceChildren(el('div', { className: 'card' }, [injectBtn]));
			}
		}),
		appLoginHelper: new Script({
			name: '软件登录辅助',
			url: [
				['超星登录', 'passport2.chaoxing.com/login'],
				['智慧树登录', 'passport.zhihuishu.com/login']
			],
			hideInPanel: true,
			oncomplete() {
				// 将面板移动至左侧顶部，防止挡住软件登录
				if ($.isInTopWindow()) {
					CommonProject.scripts.render.cfg.x = 10;
					CommonProject.scripts.render.cfg.y = 40;
					CommonProject.scripts.render.cfg.visual = 'minimize';
				}
			}
		}),
		update: new Script({
			name: '脚本更新检测',
			url: [['所有页面', /.*/]],
			hideInPanel: true,
			namespace: 'background.update',
			configs: {
				notToday: {
					defaultValue: -1
				}
			},
			oncomplete() {
				if ($.isInTopWindow()) {
					if (this.cfg.notToday === -1 || this.cfg.notToday !== new Date().getDate()) {
						const infos = $gm.getInfos();
						if (infos) {
							// 避免阻挡用户操作，这里等页面运行一段时间后再进行更新提示
							setTimeout(async () => {
								const version: { 'last-version': string; resource: Record<string, string>; notes: string[] } =
									await request('https://cdn.ocsjs.com/ocs-version.json?t=' + Date.now(), {
										method: 'get',
										type: 'fetch'
									});
								if (gt(version['last-version'], infos.script.version)) {
									const model = $model('confirm', {
										content: $creator.notes([
											`检测到新版本发布 ${version['last-version']} ：`,
											[...(version.notes || [])]
										]),
										cancelButton: el(
											'button',
											{ className: 'base-style-button-secondary', innerText: '今日不再提示' },
											(btn) => {
												btn.onclick = () => {
													this.cfg.notToday = new Date().getDate();
													model?.remove();
												};
											}
										),
										confirmButton: el('button', { className: 'base-style-button', innerText: '前往更新' }, (btn) => {
											btn.onclick = () => {
												window.open(version.resource[infos.scriptHandler], '_blank');
												model?.remove();
											};
										})
									});
								}
							}, 10 * 1000);
						}
					}
				}
			}
		}),
		errorHandle: new Script({
			name: '全局错误捕获',
			url: [['', /.*/]],
			hideInPanel: true,
			onstart() {
				const projects = definedProjects();
				for (const project of projects) {
					for (const key in project.scripts) {
						if (Object.prototype.hasOwnProperty.call(project.scripts, key)) {
							const script = project.scripts[key];
							script.on('scripterror', (err) => {
								const msg = `[${project.name} - ${script.name}] : ${err}`;
								console.error(msg);
								$console.error(msg);
							});
						}
					}
				}
			}
		})
	}
});

type Console = Record<LogType, (...msg: any[]) => void>;

/** 日志对象，存储日志并显示在日志面板 */
export const $console: Console = new Proxy({} as Console, {
	get(target, key) {
		return (...msg: any[]) => {
			let logs = BackgroundProject.scripts.console.cfg.logs;
			if (logs.length > 50) {
				logs = logs.slice(-50);
			}
			logs = logs.concat({
				type: key.toString() as LogType,
				content: msg.join(' '),
				time: Date.now(),
				stack: (Error().stack || '').replace('Error', '')
			});

			BackgroundProject.scripts.console.cfg.logs = logs;
		};
	}
});
