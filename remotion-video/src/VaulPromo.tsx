import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
	Audio,
	staticFile,
} from 'remotion';
import {TerminalQuestion} from './scenes/TerminalQuestion';
import {LogoIntro} from './scenes/LogoIntro';
import {AppDemo} from './scenes/AppDemo';
import {CTAScene} from './scenes/CTAScene';

export const VaulPromo: React.FC = () => {
	const {fps, durationInFrames} = useVideoConfig();

	// Scene timings (in frames) - 27 seconds total at 30fps = 810 frames
	// Terminal Question first
	const terminalQuestionStart = 0;
	const terminalQuestionDuration = 180; // 6 seconds

	// Logo Intro second (after terminal)
	const logoIntroStart = terminalQuestionStart + terminalQuestionDuration;
	const logoIntroDuration = 240; // 8 seconds

	// App Demo third
	const appDemoStart = logoIntroStart + logoIntroDuration;
	const ctaDuration = 90; // 3 seconds for CTA
	const appDemoDuration = durationInFrames - appDemoStart - ctaDuration; // Remaining time

	// CTA Scene last (2-3 seconds)
	const ctaStart = appDemoStart + appDemoDuration;

	return (
		<AbsoluteFill style={{backgroundColor: '#0a0a12'}}>
			{/* Audio track - plays throughout entire video */}
			<Audio src={staticFile('Kids with Lightsabers - Spazz Cardigan.mp3')}  trimBefore={28 * fps}/>

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

			{/* CTA Scene - FINAL */}
			<Sequence from={ctaStart} durationInFrames={ctaDuration}>
				<CTAScene />
			</Sequence>
		</AbsoluteFill>
	);
};
