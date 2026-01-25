import React from 'react';
import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
} from 'remotion';

const features = [
	{icon: '🎯', title: 'Quick Access', desc: 'System tray integration for instant command retrieval'},
	{icon: '💾', title: 'Persistent Storage', desc: 'Commands saved locally in your config directory'},
	{icon: '🎨', title: 'Beautiful UI', desc: 'Liquid glass design with modern aesthetics'},
	{icon: '📋', title: 'One-Click Copy', desc: 'Copy commands to clipboard instantly'},
	{icon: '🔍', title: 'Easy Organization', desc: 'View all commands in a clean, scrollable list'},
	{icon: '🖥️', title: 'Cross-Platform', desc: 'Works on macOS, Windows, and Linux'},
];

export const FeaturesShowcase: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Title animation
	const titleOpacity = interpolate(
		frame,
		[0, 30],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const titleY = interpolate(
		frame,
		[0, 30],
		[30, 0],
		{
			easing: Easing.out(Easing.ease),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Features appear one by one
	const getFeatureOpacity = (index: number) => {
		return interpolate(
			frame,
			[40 + index * 20, 50 + index * 20],
			[0, 1],
			{
				easing: Easing.ease,
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);
	};

	const getFeatureY = (index: number) => {
		return interpolate(
			frame,
			[40 + index * 20, 50 + index * 20],
			[20, 0],
			{
				easing: Easing.out(Easing.ease),
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}
		);
	};

	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 50%, #16213e 100%)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '80px 40px',
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
					opacity: titleOpacity,
					transform: `translateY(${titleY}px)`,
					textAlign: 'center',
					color: 'rgba(255, 255, 255, 0.95)',
					fontSize: '56px',
					fontWeight: 600,
					letterSpacing: '-1px',
					marginBottom: '60px',
				}}
			>
				Features
			</div>

			{/* Features grid */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: '30px',
					maxWidth: '1400px',
					width: '100%',
				}}
			>
				{features.map((feature, index) => (
					<div
						key={index}
						style={{
							opacity: getFeatureOpacity(index),
							transform: `translateY(${getFeatureY(index)}px)`,
							background: 'rgba(255, 255, 255, 0.08)',
							backdropFilter: 'blur(20px)',
							border: '1px solid rgba(255, 255, 255, 0.15)',
							borderRadius: '16px',
							padding: '30px',
							boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							textAlign: 'center',
							gap: '16px',
							transition: 'all 0.3s ease',
						}}
					>
						<div style={{fontSize: '48px'}}>{feature.icon}</div>
						<div
							style={{
								color: 'rgba(120, 180, 255, 0.9)',
								fontSize: '24px',
								fontWeight: 600,
							}}
						>
							{feature.title}
						</div>
						<div
							style={{
								color: 'rgba(255, 255, 255, 0.7)',
								fontSize: '16px',
								lineHeight: '1.5',
							}}
						>
							{feature.desc}
						</div>
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

