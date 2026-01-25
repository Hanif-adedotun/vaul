import React from 'react';
import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
} from 'remotion';

export const TerminalQuestion: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Background transition from gradient to terminal
	const bgOpacity = interpolate(
		frame,
		[0, 30],
		[1, 0],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const terminalOpacity = interpolate(
		frame,
		[0, 30],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Terminal typing animation
	const typingProgress = interpolate(
		frame,
		[30, 90],
		[0, 1],
		{
			easing: Easing.linear,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const commandText = 'git log --oneline --graph --all --decorate --pretty=format:"%C(yellow)%h%Creset - %C(cyan)%an%Creset : %s"';
	const typedText = commandText.substring(0, Math.floor(commandText.length * typingProgress));
	const showCursor = frame > 30 && frame < 90 && Math.floor(frame / 10) % 2 === 0;

	// Terminal fades to almost transparent when question appears
	const terminalFadeOpacity = interpolate(
		frame,
		[90, 120],
		[1, 0.12],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Question text animation - appears after typing is done, overlaps terminal
	const questionOpacity = interpolate(
		frame,
		[90, 120],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const questionY = interpolate(
		frame,
		[90, 120],
		[30, 0],
		{
			easing: Easing.out(Easing.ease),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<AbsoluteFill>
			{/* Gradient background (fading out) */}
			<AbsoluteFill
				style={{
					background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 50%, #16213e 100%)',
					opacity: bgOpacity,
				}}
			/>

			{/* Terminal background (fading in, then fading out when question appears) */}
			<AbsoluteFill
				style={{
					backgroundColor: '#0d1117',
					opacity: terminalOpacity * terminalFadeOpacity,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: 'SF Mono, Monaco, Consolas, monospace',
				}}
			>
				{/* Terminal window effect */}
				<div
					style={{
						width: '90%',
						maxWidth: '1200px',
						background: 'rgba(13, 17, 23, 0.95)',
						borderRadius: '12px',
						border: '1px solid rgba(255, 255, 255, 0.1)',
						boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
						padding: '40px',
						overflow: 'hidden',
					}}
				>
					{/* Terminal header */}
					<div
						style={{
							display: 'flex',
							gap: '8px',
							marginBottom: '20px',
						}}
					>
						<div
							style={{
								width: '12px',
								height: '12px',
								borderRadius: '50%',
								background: '#ff5f57',
							}}
						/>
						<div
							style={{
								width: '12px',
								height: '12px',
								borderRadius: '50%',
								background: '#ffbd2e',
							}}
						/>
						<div
							style={{
								width: '12px',
								height: '12px',
								borderRadius: '50%',
								background: '#28ca42',
							}}
						/>
					</div>

					{/* Terminal content */}
					<div
						style={{
							color: '#c9d1d9',
							fontSize: '18px',
							lineHeight: '1.6',
							fontFamily: 'SF Mono, Monaco, Consolas, monospace',
						}}
					>
						<div style={{marginBottom: '16px'}}>
							<span style={{color: '#7c3aed'}}>$</span>{' '}
							<span style={{color: '#58a6ff'}}>git</span>{' '}
							<span style={{color: '#c9d1d9'}}>
								{typedText}
								{showCursor && (
									<span
										style={{
											display: 'inline-block',
											width: '8px',
											height: '20px',
											background: '#58a6ff',
											marginLeft: '4px',
											verticalAlign: 'middle',
										}}
									/>
								)}
							</span>
						</div>
						{frame >= 90 && (
							<div style={{marginBottom: '16px', opacity: 0.7}}>
								* 3a4b5c6 (HEAD -&gt; main) Fix authentication bug
							</div>
						)}
						{frame >= 90 && (
							<div style={{marginBottom: '16px', opacity: 0.7}}>
								* 2d3e4f5 Add new feature
							</div>
						)}
						{frame >= 90 && (
							<div style={{marginBottom: '16px', opacity: 0.7}}>
								* 1a2b3c4 Initial commit
							</div>
						)}
					</div>
				</div>
			</AbsoluteFill>

			{/* Question overlay - overlaps terminal with high contrast */}
			<AbsoluteFill
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					pointerEvents: 'none',
					zIndex: 10,
				}}
			>
				<div
					style={{
						opacity: questionOpacity,
						transform: `translateY(${questionY}px)`,
						textAlign: 'center',
						color: 'rgba(255, 255, 255, 0.95)',
						fontSize: '48px',
						fontWeight: 600,
						letterSpacing: '-1px',
						textShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.5)',
						maxWidth: '1000px',
						padding: '0 40px',
						lineHeight: '1.3',
					}}
				>
					Do you find it difficult to search for long terminal commands?
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
