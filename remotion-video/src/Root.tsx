import {Composition} from 'remotion';
import {VaulPromo} from './VaulPromo';
import './style.css';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="VaulPromo"
				component={VaulPromo}
				durationInFrames={810}
				fps={30}
				width={1920}
				height={1080}
			/>
		</>
	);
};
