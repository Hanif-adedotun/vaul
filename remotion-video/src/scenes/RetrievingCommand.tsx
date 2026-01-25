import React from 'react';
import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
	Img,
	staticFile,
} from 'remotion';

const demoCategories = [
	{id: '1', name: 'Git', color: '#f97316'},
	{id: '2', name: 'Docker', color: '#0ea5e9'},
	{id: '3', name: 'Kubernetes', color: '#3b82f6'},
];

const savedCommands = [
	{id: '1', content: 'git log --oneline --graph --all --decorate', alias: 'gitlog', category: '1'},
	{id: '2', content: 'docker ps -a --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"', alias: 'dockerps', category: '2'},
	{id: '3', content: 'kubectl get pods -A -o wide', alias: 'kubepods', category: '3'},
	{id: '4', content: 'npm run build && npm run deploy', alias: '', category: '1'},
];

export const RetrievingCommand: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// App window appears
	const windowOpacity = interpolate(
		frame,
		[0, 30],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const windowScale = interpolate(
		frame,
		[0, 30],
		[0.95, 1],
		{
			easing: Easing.out(Easing.ease),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Categories appear
	const categoriesOpacity = interpolate(
		frame,
		[30, 50],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Commands appear one by one
	const getCommandOpacity = (index: number) => {
		return interpolate(
			frame,
			[50 + index * 20, 60 + index * 20],
			[0, 1],
			{
				easing: Easing.ease,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);
	};

	const getCommandY = (index: number) => {
		return interpolate(
			frame,
			[50 + index * 20, 60 + index * 20],
			[20, 0],
			{
				easing: Easing.out(Easing.ease),
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);
	};

	// Zoom into first command (the one with alias)
	const zoomStart = 130;
	const zoomDuration = 30;
	const zoomProgress = interpolate(
		frame,
		[zoomStart, zoomStart + zoomDuration],
		[0, 1],
		{
			easing: Easing.out(Easing.ease),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const isZoomed = frame >= zoomStart;
	const zoomScale = 1 + zoomProgress * 0.3;
	const zoomY = -zoomProgress * 100;

	// Copy button animation
	const copyClickOpacity = interpolate(
		frame,
		[zoomStart + zoomDuration, zoomStart + zoomDuration + 20],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const isCopied = frame > zoomStart + zoomDuration + 10;

	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 50%, #16213e 100%)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '40px',
			}}
		>
			{/* Ambient glow */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(circle at 20% 20%, rgba(120, 180, 255, 0.08) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(180, 120, 255, 0.06) 0%, transparent 40%)',
					pointerEvents: 'none',
				}}
			/>

			{/* Title */}
			<div
				style={{
					position: 'absolute',
					top: '60px',
					left: '50%',
					transform: 'translateX(-50%)',
					color: 'rgba(255, 255, 255, 0.95)',
					fontSize: '42px',
					fontWeight: 600,
					letterSpacing: '-1px',
				}}
			>
				Retrieve & Copy Instantly
			</div>

			{/* App Window - EXACT UI */}
			<div
				style={{
					opacity: windowOpacity,
					transform: `scale(${windowScale})`,
					width: '640px',
					maxWidth: '90%',
					height: '700px',
					background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 50%, #16213e 100%)',
					borderRadius: '20px',
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
					overflow: 'hidden',
					display: 'flex',
					flexDirection: 'column',
					padding: '60px 24px 24px 24px',
				}}
			>
				{/* Header - EXACT */}
				<header
					style={{
						padding: '16px 0',
						borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
						marginBottom: '20px',
						flexShrink: 0,
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: '20px',
							width: '100%',
						}}
					>
						<Img
							src={staticFile('logo-full.png')}
							style={{
								maxWidth: '140px',
								height: 'auto',
								objectFit: 'contain',
								filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))',
								flexShrink: 0,
							}}
						/>
						{/* Search container - EXACT */}
						<div
							style={{
								position: 'relative',
								flex: 1,
								maxWidth: '400px',
								marginLeft: 'auto',
							}}
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								style={{
									position: 'absolute',
									left: '12px',
									top: '50%',
									transform: 'translateY(-50%)',
									width: '14px',
									height: '14px',
									stroke: 'rgba(255, 255, 255, 0.6)',
									pointerEvents: 'none',
									zIndex: 1,
								}}
							>
								<circle cx="11" cy="11" r="8"></circle>
								<path d="m21 21-4.35-4.35"></path>
							</svg>
							<input
								type="text"
								style={{
									width: '100%',
									padding: '10px 12px 10px 34px',
									background: 'rgba(255, 255, 255, 0.08)',
									backdropFilter: 'blur(20px)',
									WebkitBackdropFilter: 'blur(20px)',
									border: '1px solid rgba(255, 255, 255, 0.15)',
									borderRadius: '8px',
									color: 'rgba(255, 255, 255, 0.95)',
									fontSize: '13px',
									fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
									transition: 'all 0.3s ease',
									outline: 'none',
									boxShadow:
										'0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
								}}
								placeholder="Search commands..."
								readOnly
							/>
						</div>
					</div>
				</header>

				{/* Category Pills - EXACT */}
				<div
					style={{
						opacity: categoriesOpacity,
						display: 'flex',
						flexWrap: 'wrap',
						gap: '8px',
						padding: '12px 0',
						marginBottom: '8px',
						flexShrink: 0,
					}}
				>
					{demoCategories.map((cat) => (
						<div
							key={cat.id}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '6px',
								padding: '6px 12px',
								background: 'rgba(255, 255, 255, 0.08)',
								backdropFilter: 'blur(20px)',
								WebkitBackdropFilter: 'blur(20px)',
								border: '1px solid rgba(255, 255, 255, 0.15)',
								borderRadius: '20px',
								color: 'rgba(255, 255, 255, 0.95)',
								fontSize: '12px',
								fontWeight: 500,
								whiteSpace: 'nowrap',
							}}
						>
							<span
								style={{
									width: '8px',
									height: '8px',
									borderRadius: '50%',
									backgroundColor: cat.color,
									flexShrink: 0,
								}}
							/>
							<span>{cat.name}</span>
						</div>
					))}
				</div>

				{/* Commands list - EXACT with Category Sections */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
						overflowY: 'auto',
						flex: 1,
						minHeight: 0,
						padding: '8px 12px 8px 4px',
					}}
				>
					{/* Git Category */}
					<div style={{marginBottom: '4px'}}>
						{/* Category Header */}
						<button
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
								width: '100%',
								padding: '10px 12px',
								background: 'rgba(255, 255, 255, 0.08)',
								backdropFilter: 'blur(16px)',
								WebkitBackdropFilter: 'blur(16px)',
								border: '1px solid rgba(255, 255, 255, 0.15)',
								borderRadius: '10px',
								color: 'rgba(255, 255, 255, 0.95)',
								fontSize: '13px',
								fontWeight: 600,
								textAlign: 'left',
								marginBottom: '8px',
								cursor: 'pointer',
							}}
						>
							<svg
								style={{
									width: '14px',
									height: '14px',
									stroke: 'rgba(255, 255, 255, 0.6)',
									flexShrink: 0,
								}}
								viewBox="0 0 24 24"
								fill="none"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<polyline points="6 9 12 15 18 9"></polyline>
							</svg>
							<span
								style={{
									width: '10px',
									height: '10px',
									borderRadius: '50%',
									backgroundColor: demoCategories[0].color,
									flexShrink: 0,
								}}
							/>
							<span style={{flex: 1, fontWeight: 600}}>Git</span>
							<span style={{color: 'rgba(255, 255, 255, 0.6)', fontWeight: 400, fontSize: '12px'}}>
								(2)
							</span>
						</button>

						{/* Category Commands */}
						<div style={{display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '8px'}}>
							{savedCommands
								.filter((cmd) => cmd.category === '1')
								.map((cmd, idx) => {
									const globalIdx = savedCommands.findIndex((c) => c.id === cmd.id);
									return (
										<div
											key={cmd.id}
											style={{
												opacity: getCommandOpacity(globalIdx),
												transform: `translateY(${getCommandY(globalIdx)}px) ${
													isZoomed && cmd.id === '1' ? `scale(${zoomScale}) translateY(${zoomY}px)` : ''
												}`,
												position: 'relative',
												background: 'rgba(255, 255, 255, 0.08)',
												backdropFilter: 'blur(16px)',
												WebkitBackdropFilter: 'blur(16px)',
												border: `1px solid ${
													isZoomed && cmd.id === '1' ? 'rgba(120, 180, 255, 0.5)' : 'rgba(255, 255, 255, 0.15)'
												}`,
												borderRadius: '12px',
												overflow: 'visible',
												transition: 'all 0.2s ease',
												zIndex: isZoomed && cmd.id === '1' ? 100 : 1,
											}}
										>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '10px',
													padding: '12px 14px',
													position: 'relative',
												}}
											>
												{/* Alias tag */}
												{cmd.alias && (
													<span
														style={{
															display: 'inline-flex',
															alignItems: 'center',
															gap: '4px',
															padding: '6px 12px',
															background: 'rgba(255, 255, 255, 0.1)',
															backdropFilter: 'blur(20px)',
															WebkitBackdropFilter: 'blur(20px)',
															border: '1px solid rgba(255, 255, 255, 0.15)',
															borderRadius: '8px',
															color: 'rgba(255, 255, 255, 0.95)',
															fontSize: '12px',
															fontWeight: 500,
															fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
															userSelect: 'none',
															flexShrink: 0,
															position: 'relative',
															zIndex: 100,
															order: -1,
															marginRight: '10px',
															whiteSpace: 'nowrap',
														}}
													>
														<span style={{color: 'rgba(255, 255, 255, 0.95)', fontWeight: 500, opacity: 0.8}}>
															@
														</span>
														{cmd.alias}
													</span>
												)}

												<code
													style={{
														flex: 1,
														minWidth: 0,
														background: 'rgba(0, 0, 0, 0.3)',
														borderRadius: '8px',
														padding: '10px 14px',
														fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
														fontSize: '13px',
														color: 'rgba(255, 255, 255, 0.95)',
														overflowX: 'auto',
														whiteSpace: 'nowrap',
														userSelect: 'text',
														WebkitUserSelect: 'text',
														position: 'relative',
														zIndex: 1,
													}}
												>
													{cmd.content}
												</code>
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														gap: '8px',
														flexShrink: 0,
													}}
												>
													<div
														style={{
															width: '36px',
															height: '36px',
															background:
																isCopied && cmd.id === '1'
																	? 'rgba(100, 220, 150, 0.15)'
																	: 'rgba(255, 255, 255, 0.06)',
															border: `1px solid ${
																isCopied && cmd.id === '1'
																	? 'rgba(100, 220, 150, 0.9)'
																	: 'rgba(255, 255, 255, 0.1)'
															}`,
															borderRadius: '8px',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															cursor: 'pointer',
															transition: 'all 0.2s ease',
															opacity: cmd.id === '1' ? copyClickOpacity : 1,
															transform: isCopied && cmd.id === '1' ? 'scale(0.95)' : 'scale(1)',
														}}
													>
														{isCopied && cmd.id === '1' ? (
															<svg
																viewBox="0 0 24 24"
																fill="none"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
																style={{
																	width: '18px',
																	height: '18px',
																	stroke: 'rgba(100, 220, 150, 0.9)',
																}}
															>
																<polyline points="20 6 9 17 4 12"></polyline>
															</svg>
														) : (
															<svg
																viewBox="0 0 24 24"
																fill="none"
																strokeWidth="2"
																strokeLinecap="round"
																strokeLinejoin="round"
																style={{
																	width: '18px',
																	height: '18px',
																	stroke: 'rgba(255, 255, 255, 0.6)',
																}}
															>
																<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
																<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
															</svg>
														)}
													</div>
												</div>
											</div>
										</div>
									);
								})}
						</div>
					</div>

					{/* Docker Category */}
					<div style={{marginBottom: '4px'}}>
						<button
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
								width: '100%',
								padding: '10px 12px',
								background: 'rgba(255, 255, 255, 0.08)',
								backdropFilter: 'blur(16px)',
								WebkitBackdropFilter: 'blur(16px)',
								border: '1px solid rgba(255, 255, 255, 0.15)',
								borderRadius: '10px',
								color: 'rgba(255, 255, 255, 0.95)',
								fontSize: '13px',
								fontWeight: 600,
								textAlign: 'left',
								marginBottom: '8px',
								cursor: 'pointer',
							}}
						>
							<svg
								style={{
									width: '14px',
									height: '14px',
									stroke: 'rgba(255, 255, 255, 0.6)',
									flexShrink: 0,
								}}
								viewBox="0 0 24 24"
								fill="none"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<polyline points="6 9 12 15 18 9"></polyline>
							</svg>
							<span
								style={{
									width: '10px',
									height: '10px',
									borderRadius: '50%',
									backgroundColor: demoCategories[1].color,
									flexShrink: 0,
								}}
							/>
							<span style={{flex: 1, fontWeight: 600}}>Docker</span>
							<span style={{color: 'rgba(255, 255, 255, 0.6)', fontWeight: 400, fontSize: '12px'}}>
								(1)
							</span>
						</button>
						<div style={{display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '8px'}}>
							{savedCommands
								.filter((cmd) => cmd.category === '2')
								.map((cmd, idx) => {
									const globalIdx = savedCommands.findIndex((c) => c.id === cmd.id);
									return (
										<div
											key={cmd.id}
											style={{
												opacity: getCommandOpacity(globalIdx),
												transform: `translateY(${getCommandY(globalIdx)}px)`,
												position: 'relative',
												background: 'rgba(255, 255, 255, 0.08)',
												backdropFilter: 'blur(16px)',
												WebkitBackdropFilter: 'blur(16px)',
												border: '1px solid rgba(255, 255, 255, 0.15)',
												borderRadius: '12px',
												overflow: 'visible',
											}}
										>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '10px',
													padding: '12px 14px',
												}}
											>
												{cmd.alias && (
													<span
														style={{
															display: 'inline-flex',
															alignItems: 'center',
															gap: '4px',
															padding: '6px 12px',
															background: 'rgba(255, 255, 255, 0.1)',
															backdropFilter: 'blur(20px)',
															WebkitBackdropFilter: 'blur(20px)',
															border: '1px solid rgba(255, 255, 255, 0.15)',
															borderRadius: '8px',
															color: 'rgba(255, 255, 255, 0.95)',
															fontSize: '12px',
															fontWeight: 500,
															fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
															marginRight: '10px',
															whiteSpace: 'nowrap',
														}}
													>
														<span style={{opacity: 0.8}}>@</span>
														{cmd.alias}
													</span>
												)}
												<code
													style={{
														flex: 1,
														background: 'rgba(0, 0, 0, 0.3)',
														borderRadius: '8px',
														padding: '10px 14px',
														fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
														fontSize: '13px',
														color: 'rgba(255, 255, 255, 0.95)',
														whiteSpace: 'nowrap',
													}}
												>
													{cmd.content}
												</code>
												<div
													style={{
														width: '36px',
														height: '36px',
														background: 'rgba(255, 255, 255, 0.06)',
														border: '1px solid rgba(255, 255, 255, 0.1)',
														borderRadius: '8px',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													<svg
														viewBox="0 0 24 24"
														fill="none"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														style={{
															width: '18px',
															height: '18px',
															stroke: 'rgba(255, 255, 255, 0.6)',
														}}
													>
														<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
														<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
													</svg>
												</div>
											</div>
										</div>
									);
								})}
						</div>
					</div>

					{/* Kubernetes Category */}
					<div>
						<button
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
								width: '100%',
								padding: '10px 12px',
								background: 'rgba(255, 255, 255, 0.08)',
								backdropFilter: 'blur(16px)',
								WebkitBackdropFilter: 'blur(16px)',
								border: '1px solid rgba(255, 255, 255, 0.15)',
								borderRadius: '10px',
								color: 'rgba(255, 255, 255, 0.95)',
								fontSize: '13px',
								fontWeight: 600,
								textAlign: 'left',
								marginBottom: '8px',
								cursor: 'pointer',
							}}
						>
							<svg
								style={{
									width: '14px',
									height: '14px',
									stroke: 'rgba(255, 255, 255, 0.6)',
									flexShrink: 0,
								}}
								viewBox="0 0 24 24"
								fill="none"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<polyline points="6 9 12 15 18 9"></polyline>
							</svg>
							<span
								style={{
									width: '10px',
									height: '10px',
									borderRadius: '50%',
									backgroundColor: demoCategories[2].color,
									flexShrink: 0,
								}}
							/>
							<span style={{flex: 1, fontWeight: 600}}>Kubernetes</span>
							<span style={{color: 'rgba(255, 255, 255, 0.6)', fontWeight: 400, fontSize: '12px'}}>
								(1)
							</span>
						</button>
						<div style={{display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '8px'}}>
							{savedCommands
								.filter((cmd) => cmd.category === '3')
								.map((cmd, idx) => {
									const globalIdx = savedCommands.findIndex((c) => c.id === cmd.id);
									return (
										<div
											key={cmd.id}
											style={{
												opacity: getCommandOpacity(globalIdx),
												transform: `translateY(${getCommandY(globalIdx)}px)`,
												position: 'relative',
												background: 'rgba(255, 255, 255, 0.08)',
												backdropFilter: 'blur(16px)',
												WebkitBackdropFilter: 'blur(16px)',
												border: '1px solid rgba(255, 255, 255, 0.15)',
												borderRadius: '12px',
												overflow: 'visible',
											}}
										>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '10px',
													padding: '12px 14px',
												}}
											>
												{cmd.alias && (
													<span
														style={{
															display: 'inline-flex',
															alignItems: 'center',
															gap: '4px',
															padding: '6px 12px',
															background: 'rgba(255, 255, 255, 0.1)',
															backdropFilter: 'blur(20px)',
															WebkitBackdropFilter: 'blur(20px)',
															border: '1px solid rgba(255, 255, 255, 0.15)',
															borderRadius: '8px',
															color: 'rgba(255, 255, 255, 0.95)',
															fontSize: '12px',
															fontWeight: 500,
															fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
															marginRight: '10px',
															whiteSpace: 'nowrap',
														}}
													>
														<span style={{opacity: 0.8}}>@</span>
														{cmd.alias}
													</span>
												)}
												<code
													style={{
														flex: 1,
														background: 'rgba(0, 0, 0, 0.3)',
														borderRadius: '8px',
														padding: '10px 14px',
														fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
														fontSize: '13px',
														color: 'rgba(255, 255, 255, 0.95)',
														whiteSpace: 'nowrap',
													}}
												>
													{cmd.content}
												</code>
												<div
													style={{
														width: '36px',
														height: '36px',
														background: 'rgba(255, 255, 255, 0.06)',
														border: '1px solid rgba(255, 255, 255, 0.1)',
														borderRadius: '8px',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													<svg
														viewBox="0 0 24 24"
														fill="none"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														style={{
															width: '18px',
															height: '18px',
															stroke: 'rgba(255, 255, 255, 0.6)',
														}}
													>
														<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
														<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
													</svg>
												</div>
											</div>
										</div>
									);
								})}
						</div>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
