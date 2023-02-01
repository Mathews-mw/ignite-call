import { z } from 'zod';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { unstable_getServerSession } from 'next-auth';

import { Avatar, Button, Heading, MultiStep, Text, TextArea } from '@ignite-ui/react';

import { api } from '../../../lib/axios';
import { buildNextAuthOptions } from '../../api/auth/[...nextauth].api';

import { ArrowRight } from 'phosphor-react';
import { Container, Header } from '../styles';
import { FormAnnotation, ProfileBox } from './styles';

const updateProfileFormSchema = z.object({
	bio: z.string(),
});

type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>;

export default function UpdateProfile() {
	const {
		handleSubmit,
		register,
		formState: { isSubmitting },
	} = useForm<UpdateProfileFormData>({
		resolver: zodResolver(updateProfileFormSchema),
	});

	const session = useSession();
	const router = useRouter();

	async function handleUpdateProfile(data: UpdateProfileFormData) {
		try {
			await api.put('users/profile', {
				bio: data.bio,
			});

			await router.push(`/schedule/${session.data?.user.username}`);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<Container>
			<Header>
				<Heading as='strong'>Bem-vindo ao Ignite Call!</Heading>

				<Text>Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.</Text>

				<MultiStep size={4} currentStep={4} />
			</Header>

			<ProfileBox as='form' onSubmit={handleSubmit(handleUpdateProfile)}>
				<label>
					<Text size='sm'>Foto de perfil</Text>
					<Avatar src={session.data?.user.avatar_url} alt={session.data?.user.name} />
				</label>

				<label>
					<Text size='sm'>Sobre você</Text>
					<TextArea placeholder='Seu nome' {...register('bio')} />
					<FormAnnotation size='sm'>Fale um pouco sobre você. Isto será exibido em sua página inicial.</FormAnnotation>
				</label>

				<Button type='submit' disabled={isSubmitting}>
					Finalizer
					<ArrowRight />
				</Button>
			</ProfileBox>
		</Container>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const session = await unstable_getServerSession(req, res, buildNextAuthOptions(req, res));

	return {
		props: {
			session,
		},
	};
};
