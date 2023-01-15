import { z } from 'zod';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, TextInput, Text } from '@ignite-ui/react';

import { ArrowRight } from 'phosphor-react';
import { Form, FormAnnotation } from './styles';

const claimUserNameFormSchema = z.object({
	username: z
		.string()
		.min(3, { message: 'No mínimo 3 caracteres.' })
		.regex(/^([a-z\\-]+)$/i, { message: 'Pode conter apenas letras e hifens.' })
		.transform((username) => username.toLocaleLowerCase()),
});

type ClaimUserNameFormData = z.infer<typeof claimUserNameFormSchema>;

export function ClaimUserNameForm() {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<ClaimUserNameFormData>({
		resolver: zodResolver(claimUserNameFormSchema),
	});

	const router = useRouter();

	async function handleClaimUserName(data: ClaimUserNameFormData) {
		const { username } = data;

		await router.push(`/register?username=${username}`);
	}

	return (
		<>
			<Form as='form' onSubmit={handleSubmit(handleClaimUserName)}>
				<TextInput size='sm' prefix='ignite.com/' placeholder='seu-usuário' {...register('username')} />
				<Button size='sm' type='submit' disabled={isSubmitting}>
					Reservar
					<ArrowRight />
				</Button>
			</Form>

			<FormAnnotation>
				<Text size='sm'>{errors.username ? errors.username.message : 'Digite o nome do usuário desejado'}</Text>
			</FormAnnotation>
		</>
	);
}
