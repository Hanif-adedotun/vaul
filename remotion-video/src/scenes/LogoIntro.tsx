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

	// Safe appears first
	const safeOpacity = interpolate(
		frame,
		[0, 40],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const safeScale = interpolate(
		frame,
		[0, 40],
		[0.8, 1],
		{
			easing: Easing.out(Easing.ease),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Safe door opens smoothly (slides left)
	const doorX = interpolate(
		frame,
		[40, 100],
		[0, -280],
		{
			easing: Easing.out(Easing.ease),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Logo slides to the RIGHT out of safe (bigger, in front)
	const logoStartFrame = 80;
	const logoSlideOutEnd = 160;
	
	// Logo slides out to the right
	const logoSlideOutX = interpolate(
		frame,
		[logoStartFrame, logoSlideOutEnd],
		[0, 300], // Slides to the right
		{
			easing: Easing.out(Easing.ease),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Logo is bigger when sliding out
	const logoSlideOutScale = interpolate(
		frame,
		[logoStartFrame, logoSlideOutEnd],
		[0.7, 1], // Bigger when sliding out
		{
			easing: Easing.out(Easing.ease),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const logoSlideOutOpacity = interpolate(
		frame,
		[logoStartFrame, logoStartFrame + 20],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Logo slides back to center
	const logoSlideBackStart = logoSlideOutEnd;
	const logoSlideBackEnd = 200;
	
	const logoSlideBackX = interpolate(
		frame,
		[logoSlideBackStart, logoSlideBackEnd],
		[300, 0], // Slides back to center
		{
			easing: Easing.inOut(Easing.ease),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Final Y position for logo (constant throughout slide out/back)
	const logoFinalY = -100; // Final Y position - this stays constant

	const logoFinalScale = interpolate(
		frame,
		[logoSlideBackStart, logoSlideBackEnd],
		[1, 1], // Scales to final size
		{
			easing: Easing.out(Easing.ease),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Safe disappears while logo moves to center
	const safeFadeOut = interpolate(
		frame,
		[logoSlideBackStart, logoSlideBackEnd],
		[1, 0],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// "Introducing Vaul" text animation (appears after logo settles)
	const textOpacity = interpolate(
		frame,
		[logoSlideBackEnd, logoSlideBackEnd + 30],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const textY = interpolate(
		frame,
		[logoSlideBackEnd, logoSlideBackEnd + 30],
		[30, 0],
		{
			easing: Easing.out(Easing.ease),
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Tagline appears
	const taglineOpacity = interpolate(
		frame,
		[logoSlideBackEnd + 30, logoSlideBackEnd + 60],
		[0, 1],
		{
			easing: Easing.ease,
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Determine logo position and properties based on frame
	// Y position stays constant at final position throughout the animation
	const getLogoProps = () => {
		if (frame < logoStartFrame) {
			// Logo is inside safe, not visible yet
			return {x: 0, y: logoFinalY, scale: 0.4, opacity: 0};
		} else if (frame < logoSlideOutEnd) {
			// Logo is sliding out to the right (ONLY X movement, Y stays at final position)
			return {x: logoSlideOutX, y: logoFinalY, scale: logoSlideOutScale, opacity: logoSlideOutOpacity};
		} else if (frame < logoSlideBackEnd) {
			// Logo is sliding back to center (ONLY X movement, Y stays at final position)
			return {x: logoSlideBackX, y: logoFinalY, scale: logoFinalScale, opacity: 1};
		} else {
			// Logo is in final position (Y already at final position)
			return {x: 0, y: logoFinalY, scale: 1, opacity: 1};
		}
	};

	const logoProps = getLogoProps();

	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 50%, #16213e 100%)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
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

			{/* Safe container */}
			<div
				style={{
					opacity: safeOpacity * safeFadeOut,
					transform: `scale(${safeScale})`,
					position: 'relative',
					width: '300px',
					height: '300px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 1,
				}}
			>
				{/* Safe body */}
				<div
					style={{
						position: 'absolute',
						width: '280px',
						height: '280px',
						background: 'linear-gradient(135deg, #2a2a3a 0%, #1a1a2a 100%)',
						borderRadius: '20px',
						border: '3px solid rgba(255, 255, 255, 0.1)',
						boxShadow: 'inset 0 4px 20px rgba(0, 0, 0, 0.5), 0 8px 32px rgba(0, 0, 0, 0.3)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						overflow: 'hidden',
					}}
				>
					{/* Safe door (opens - slides left) */}
					<div
						style={{
							position: 'absolute',
							width: '280px',
							height: '280px',
							background: 'linear-gradient(135deg, #3a3a4a 0%, #2a2a3a 100%)',
							borderRadius: '20px',
							border: '3px solid rgba(255, 255, 255, 0.15)',
							boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
							transform: `translateX(${doorX}px)`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							zIndex: 2,
						}}
					>
						{/* Safe lock/handle */}
						<div
							style={{
								width: '60px',
								height: '60px',
								borderRadius: '50%',
								background: 'radial-gradient(circle, #4a4a5a 0%, #2a2a3a 100%)',
								border: '2px solid rgba(255, 255, 255, 0.2)',
								boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5)',
							}}
						/>
					</div>
				</div>
			</div>

			{/* Logo - slides out to right, then back to center (HIGH Z-INDEX, IN FRONT) */}
			{frame >= logoStartFrame && (
				<div
					style={{
						opacity: logoProps.opacity,
						transform: `translateX(${logoProps.x}px) translateY(${logoProps.y}px) scale(${logoProps.scale})`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						position: 'absolute',
						top: '50%', // Center point - Y offset handled by translateY
						left: '50%',
						marginLeft: frame < logoSlideBackEnd ? '-90px' : '-200px', // Adjust based on scale
						zIndex: 100, // HIGH Z-INDEX - in front of everything
					}}
				>
					<Img
						src={staticFile('logo-full.png')}
						style={{
							width: frame < logoSlideBackEnd ? '360px' : '400px', // Bigger when sliding out
							height: 'auto',
							filter: 'drop-shadow(0 4px 20px rgba(120, 180, 255, 0.5))',
							transition: 'width 0.3s ease',
						}}
					/>
				</div>
			)}

			{/* "Introducing Vaul" text - positioned below the logo */}
			<div
				style={{
					opacity: textOpacity,
					transform: `translate(-50%, ${textY}px)`,
					textAlign: 'center',
					color: 'rgba(255, 255, 255, 0.95)',
					fontSize: '48px',
					fontWeight: 600,
					letterSpacing: '-1px',
					position: 'absolute',
					top: '58%', // Moved down further below the logo
					left: '50%',
					zIndex: 50,
				}}
			>
				Meet Vaul
			</div>

			{/* Tagline */}
			<div
				style={{
					opacity: taglineOpacity,
					textAlign: 'center',
					color: 'rgba(255, 255, 255, 0.7)',
					fontSize: '24px',
					fontWeight: 400,
					letterSpacing: '-0.5px',
					position: 'absolute',
					top: '65%',
					left: '50%',
					transform: 'translateX(-50%)',
					zIndex: 50,
				}}
			>
				Your terminal commands, always at your fingertips
			</div>
		</AbsoluteFill>
	);
};
