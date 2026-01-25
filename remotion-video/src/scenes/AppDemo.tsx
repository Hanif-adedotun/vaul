import React from 'react';
import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
	Sequence,
} from 'remotion';
import {SavingCommand} from './SavingCommand';
import {RetrievingCommand} from './RetrievingCommand';

export const AppDemo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// Split demo into two parts: saving and retrieving
	const savingDuration = Math.floor(durationInFrames / 2);
	const retrievingStart = savingDuration;

	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 50%, #16213e 100%)',
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

			{/* Saving Command Demo */}
			<Sequence from={0} durationInFrames={savingDuration}>
				<SavingCommand />
			</Sequence>

			{/* Retrieving Command Demo */}
			<Sequence from={retrievingStart} durationInFrames={durationInFrames - retrievingStart}>
				<RetrievingCommand />
			</Sequence>
		</AbsoluteFill>
	);
};

