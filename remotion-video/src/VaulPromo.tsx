import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
} from 'remotion';
import {TerminalQuestion} from './scenes/TerminalQuestion';
import {LogoIntro} from './scenes/LogoIntro';
import {AppDemo} from './scenes/AppDemo';

export const VaulPromo: React.FC = () => {
	const {fps, durationInFrames} = useVideoConfig();

	// Scene timings (in frames) - 30 seconds total at 30fps = 900 frames
	// Terminal Question first
	const terminalQuestionStart = 0;
	const terminalQuestionDuration = 180; // 6 seconds

	// Logo Intro second (after terminal)
	const logoIntroStart = terminalQuestionStart + terminalQuestionDuration;
	const logoIntroDuration = 240; // 8 seconds

	// App Demo third
	const appDemoStart = logoIntroStart + logoIntroDuration;
	const appDemoDuration = durationInFrames - appDemoStart;

	return (
		<AbsoluteFill style={{backgroundColor: '#0a0a12'}}>
			{/* Terminal Question Scene - FIRST */}
			<Sequence
				from={terminalQuestionStart}
				durationInFrames={terminalQuestionDuration}
			>
				<TerminalQuestion />
			</Sequence>

			{/* Logo Intro Scene - SECOND */}
			<Sequence from={logoIntroStart} durationInFrames={logoIntroDuration}>
				<LogoIntro />
			</Sequence>

			{/* App Demo Scene - THIRD */}
			<Sequence from={appDemoStart} durationInFrames={appDemoDuration}>
				<AppDemo />
			</Sequence>
		</AbsoluteFill>
	);
};
