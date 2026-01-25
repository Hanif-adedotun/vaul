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

export const CTAScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Logo appears
	const logoOpacity = interpolate(
		frame,
		[0, 20],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const logoScale = interpolate(
		frame,
		[0, 20],
		[0.9, 1],
		{
			easing: Easing.out(Easing.ease),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// CTA text appears
	const ctaOpacity = interpolate(
		frame,
		[20, 40],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const ctaY = interpolate(
		frame,
		[20, 40],
		[20, 0],
		{
			easing: Easing.out(Easing.ease),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// GitHub link appears
	const linkOpacity = interpolate(
		frame,
		[40, 60],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const linkY = interpolate(
		frame,
		[40, 60],
		[20, 0],
		{
			easing: Easing.out(Easing.ease),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Star text appears
	const starOpacity = interpolate(
		frame,
		[50, 70],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 50%, #16213e 100%)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '30px',
			}}
		>
			{/* Ambient glow */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(circle at 50% 50%, rgba(120, 180, 255, 0.08) 0%, transparent 60%)',
					pointerEvents: 'none',
				}}
			/>

			{/* Logo */}
			<div
				style={{
					opacity: logoOpacity,
					transform: `scale(${logoScale})`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Img
					src={staticFile('logo-full.png')}
					style={{
						width: '300px',
						height: 'auto',
						filter: 'drop-shadow(0 4px 20px rgba(120, 180, 255, 0.3))',
					}}
				/>
			</div>

			{/* CTA Text */}
			<div
				style={{
					opacity: ctaOpacity,
					transform: `translateY(${ctaY}px)`,
					textAlign: 'center',
					color: 'rgba(255, 255, 255, 0.95)',
					fontSize: '42px',
					fontWeight: 600,
					letterSpacing: '-1px',
				}}
			>
				Download it for free on GitHub
			</div>

			{/* GitHub Link */}
			<div
				style={{
					opacity: linkOpacity,
					transform: `translateY(${linkY}px)`,
					textAlign: 'center',
				}}
			>
				<div
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: '12px',
						padding: '16px 32px',
						background: 'rgba(255, 255, 255, 0.08)',
						backdropFilter: 'blur(20px)',
						WebkitBackdropFilter: 'blur(20px)',
						border: '1px solid rgba(255, 255, 255, 0.15)',
						borderRadius: '12px',
						boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
					}}
				>
					<svg
						viewBox="0 0 24 24"
						fill="currentColor"
						style={{
							width: '24px',
							height: '24px',
							color: 'rgba(255, 255, 255, 0.95)',
						}}
					>
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
					</svg>
					<span
						style={{
							color: 'rgba(120, 180, 255, 0.9)',
							fontSize: '28px',
							fontWeight: 500,
							fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
							letterSpacing: '-0.5px',
						}}
					>
						vaul.hanif.one
					</span>
				</div>
			</div>

			{/* Star text */}
			<div
				style={{
					opacity: starOpacity,
					textAlign: 'center',
					color: 'rgba(255, 255, 255, 0.7)',
					fontSize: '20px',
					fontWeight: 400,
					letterSpacing: '-0.5px',
				}}
			>
				<span style={{marginRight: '8px'}}>⭐</span>   Drop a Star if you love it
			</div>
		</AbsoluteFill>
	);
};

