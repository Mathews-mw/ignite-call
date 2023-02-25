import { Heading, Text } from '@ignite-ui/react';
import { NextSeo } from 'next-seo/lib/meta/nextSEO';
import Image from 'next/image';

import previewImage from '../../assets/app-preview.png';
import { ClaimUserNameForm } from './components/ClaimUserNameForm';
import { Container, Hero, Preview } from './styles';

export default function Home() {
	return (
		<>
			<NextSeo title='Descomplique sua agenda | Ignite Call' description='Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.' />

			<Container>
				<Hero>
					<Heading size='4xl'>Agendamento descomplicado</Heading>
					<Text size='xl'>Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.</Text>

					<ClaimUserNameForm />
				</Hero>

				<Preview>
					<Image src={previewImage} height={400} quality={100} priority alt='Imagem de um calendário apresentação da landpage' />
				</Preview>
			</Container>
		</>
	);
}
