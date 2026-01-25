import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
} from 'remotion';
import {LogoIntro} from './scenes/LogoIntro';
import {TerminalQuestion} from './scenes/TerminalQuestion';
import {AppDemo} from './scenes/AppDemo';

export const VaulPromo: React.FC = () => {
	const {fps, durationInFrames} = useVideoConfig();

	// Scene timings (in frames)
	const logoIntroStart = 0;
	const logoIntroDuration = 90; // 3 seconds

	const terminalQuestionStart = logoIntroStart + logoIntroDuration;
	const terminalQuestionDuration = 150; // 5 seconds

	const appDemoStart = terminalQuestionStart + terminalQuestionDuration;
	const appDemoDuration = durationInFrames - appDemoStart;

	return (
		<AbsoluteFill style={{backgroundColor: '#0a0a12'}}>
			{/* Logo Intro Scene */}
			<Sequence from={logoIntroStart} durationInFrames={logoIntroDuration}>
				<LogoIntro />
			</Sequence>

			{/* Terminal Question Scene */}
			<Sequence
				from={terminalQuestionStart}
				durationInFrames={terminalQuestionDuration}
			>
				<TerminalQuestion />
			</Sequence>

			{/* App Demo Scene */}
			<Sequence from={appDemoStart} durationInFrames={appDemoDuration}>
				<AppDemo />
			</Sequence>
		</AbsoluteFill>
	);
};

