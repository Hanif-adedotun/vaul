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

export const LogoIntro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Logo animation - pops up with scale and fade
	const logoScale = interpolate(
		frame,
		[0, 30, 60],
		[0, 1.2, 1],
		{
			easing: Easing.out(Easing.back(1.2)),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

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

	// Text animation - fades in after logo
	const textOpacity = interpolate(
		frame,
		[30, 50],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const textY = interpolate(
		frame,
		[30, 50],
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
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '40px',
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
					transform: `scale(${logoScale})`,
					opacity: logoOpacity,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Img
					src={staticFile('logo-full.png')}
					style={{
						width: '400px',
						height: 'auto',
						filter: 'drop-shadow(0 4px 20px rgba(120, 180, 255, 0.3))',
					}}
				/>
			</div>

			{/* Tagline */}
			<div
				style={{
					opacity: textOpacity,
					transform: `translateY(${textY}px)`,
					textAlign: 'center',
					color: 'rgba(255, 255, 255, 0.95)',
					fontSize: '32px',
					fontWeight: 500,
					letterSpacing: '-0.5px',
				}}
			>
				A vault for your terminal commands
			</div>
		</AbsoluteFill>
	);
};

