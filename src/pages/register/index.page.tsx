import { z } from 'zod';
import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react';

import { api } from '../../lib/axios';

import { ArrowRight } from 'phosphor-react';
import { Container, Form, Header, FormError } from './styles';
import { NextSeo } from 'next-seo';

const registerFormSchema = z.object({
	username: z
		.string()
		.min(3, { message: 'No mínimo 3 caracteres.' })
		.regex(/^([a-z\\-]+)$/i, { message: 'Pode conter apenas letras e hifens.' })
		.transform((username) => username.toLocaleLowerCase()),
	name: z.string().min(3, { message: 'O nome precisa ter no mínimo 3 caracteres' }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
	const {
		handleSubmit,
		register,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerFormSchema),
	});

	const router = useRouter();

	useEffect(() => {
		if (router.query.username) {
			setValue('username', String(router.query.username));
		}
	}, [router.query?.username, setValue]);

	async function handleRegister(data: RegisterFormData) {
		try {
			await api.post('/users', {
				username: data.username,
				name: data.name,
			});

			await router.push('/register/connect-calendar');
		} catch (error) {
			if (error instanceof AxiosError && error?.response?.data?.message) {
				alert(error.response.data.message);
				return;
			}

			console.log(error);
		}
	}

	return (
		<>
			<NextSeo title='Descomplique sua agenda | Ignite Call' />

			<Container>
				<Header>
					<Heading as='strong'>Bem-vindo ao Ignite Call!</Heading>

					<Text>Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.</Text>

					<MultiStep size={4} currentStep={1} />
				</Header>

				<Form as='form' onSubmit={handleSubmit(handleRegister)}>
					<label>
						<Text size='sm'>Nome do usuário</Text>
						<TextInput prefix='ignite.com/' placeholder='seu-usuário' {...register('username')} />

						{errors.username && <FormError size='sm'>{errors.username.message}</FormError>}
					</label>

					<label>
						<Text size='sm'>Nome completo</Text>
						<TextInput placeholder='Seu nome' {...register('name')} />

						{errors.name && <FormError size='sm'>{errors.name.message}</FormError>}
					</label>

					<Button type='submit' disabled={isSubmitting}>
						Próximo passo
						<ArrowRight />
					</Button>
				</Form>
			</Container>
		</>
	);
}
