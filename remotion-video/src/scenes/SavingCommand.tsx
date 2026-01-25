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

export const SavingCommand: React.FC = () => {
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

	// Typing animation
	const typingProgress = interpolate(
		frame,
		[50, 140],
		[0, 1],
		{
			easing: Easing.linear,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const commandText = 'git log --oneline --graph --all --decorate';
	const typedText = commandText.substring(0, Math.floor(commandText.length * typingProgress));
	const showCursor = frame > 50 && frame < 140 && Math.floor(frame / 10) % 2 === 0;

	// Alias typing
	const aliasTypingProgress = interpolate(
		frame,
		[140, 160],
		[0, 1],
		{
			easing: Easing.linear,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const aliasText = 'gitlog';
	const typedAlias = aliasText.substring(0, Math.floor(aliasText.length * aliasTypingProgress));
	const showAliasCursor = frame > 140 && frame < 160 && Math.floor(frame / 10) % 2 === 0;

	// Command saved animation
	const savedOpacity = interpolate(
		frame,
		[160, 180],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const savedY = interpolate(
		frame,
		[160, 180],
		[20, 0],
		{
			easing: Easing.out(Easing.ease),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

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
				Save Commands Instantly
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

				{/* Input form - EXACT with Alias */}
				<form
					style={{
						marginBottom: '20px',
						flexShrink: 0,
					}}
				>
					<div
						style={{
							display: 'flex',
							gap: '12px',
							alignItems: 'stretch',
						}}
					>
						{/* Command input */}
						<div
							style={{
								flex: 1,
								background: 'rgba(255, 255, 255, 0.08)',
								backdropFilter: 'blur(20px)',
								WebkitBackdropFilter: 'blur(20px)',
								border: '1px solid rgba(255, 255, 255, 0.15)',
								borderRadius: '16px',
								padding: '4px',
								boxShadow:
									'0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
							}}
						>
							<div
								style={{
									padding: '14px 16px',
									fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
									fontSize: '14px',
									color: 'rgba(255, 255, 255, 0.95)',
									display: 'flex',
									alignItems: 'center',
									gap: '4px',
								}}
							>
								<span>{typedText}</span>
								{showCursor && (
									<span
										style={{
											width: '2px',
											height: '20px',
											background: 'rgba(120, 180, 255, 0.9)',
											display: 'inline-block',
										}}
									/>
								)}
							</div>
						</div>

						{/* Alias input */}
						<div
							style={{
								width: '180px',
								background: 'rgba(255, 255, 255, 0.08)',
								backdropFilter: 'blur(20px)',
								WebkitBackdropFilter: 'blur(20px)',
								border: '1px solid rgba(255, 255, 255, 0.15)',
								borderRadius: '16px',
								padding: '4px',
								boxShadow:
									'0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
							}}
						>
							<div
								style={{
									padding: '14px 16px',
									fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
									fontSize: '14px',
									color: frame >= 140 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.6)',
									display: 'flex',
									alignItems: 'center',
									gap: '4px',
								}}
							>
								{frame >= 140 ? (
									<>
										<span>{typedAlias}</span>
										{showAliasCursor && (
											<span
												style={{
													width: '2px',
													height: '20px',
													background: 'rgba(120, 180, 255, 0.9)',
													display: 'inline-block',
												}}
											/>
										)}
									</>
								) : (
									<span style={{fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"}}>
										Alias (optional)
									</span>
								)}
							</div>
						</div>

						{/* Category Selector */}
						<div
							style={{
								position: 'relative',
								flexShrink: 0,
							}}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '8px',
									padding: '14px 16px',
									height: '100%',
									background: 'rgba(255, 255, 255, 0.08)',
									backdropFilter: 'blur(20px)',
									WebkitBackdropFilter: 'blur(20px)',
									border: '1px solid rgba(255, 255, 255, 0.15)',
									borderRadius: '8px',
									color: 'rgba(255, 255, 255, 0.95)',
									fontSize: '13px',
									cursor: 'pointer',
									whiteSpace: 'nowrap',
									minWidth: '140px',
								}}
							>
								<span style={{flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis'}}>
									Category
								</span>
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
							</div>
						</div>
					</div>
				</form>

				{/* Commands list - EXACT */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '12px',
						overflowY: 'auto',
						flex: 1,
						minHeight: 0,
						padding: '8px 12px 8px 4px',
					}}
				>
					{/* Saved command appears */}
					{frame > 160 && (
						<div
							style={{
								opacity: savedOpacity,
								transform: `translateY(${savedY}px)`,
								position: 'relative',
								background: 'rgba(255, 255, 255, 0.08)',
								backdropFilter: 'blur(16px)',
								WebkitBackdropFilter: 'blur(16px)',
								border: '1px solid rgba(255, 255, 255, 0.15)',
								borderRadius: '12px',
								overflow: 'visible',
								transition: 'all 0.2s ease',
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
									<span style={{color: 'rgba(255, 255, 255, 0.95)', fontWeight: 500, opacity: 0.8}}>@</span>
									{typedAlias}
								</span>

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
									{commandText}
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
											background: 'rgba(255, 255, 255, 0.06)',
											border: '1px solid rgba(255, 255, 255, 0.1)',
											borderRadius: '8px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											cursor: 'pointer',
											transition: 'all 0.2s ease',
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
						</div>
					)}
				</div>
			</div>
		</AbsoluteFill>
	);
};
