import dayjs from 'dayjs';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { api } from '../../../../../lib/axios';
import { Calendar } from '../../../../../components/Calendar';

import { Container, TimePicker, TimePickerHeader, TimePickerItem, TimePickerList } from './styles';

interface Availability {
	possibleTimes: number[];
	availableTimes: number[];
}

interface CalendarStepsProps {
	onSelectDateTime: (date: Date) => void;
}

export function CalendarStep({ onSelectDateTime }: CalendarStepsProps) {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	const router = useRouter();

	const isDateSelected = !!selectedDate;
	const username = String(router.query.username);

	const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null;
	const decribedDay = selectedDate ? dayjs(selectedDate).format('DD[ de ]MMMM') : null;

	const selectedDateWithoutTime = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null;

	const { data: availability } = useQuery<Availability>(
		['availability', selectedDateWithoutTime],
		async () => {
			const response = api.get(`/users/${username}/availability`, {
				params: {
					date: dayjs(selectedDate).format('YYYY-MM-DD'),
				},
			});

			return (await response).data;
		},
		{ enabled: !!selectedDate }
	);

	function handleSelectTime(hour: number) {
		const dateWithTime = dayjs(selectedDate).set('hour', hour).startOf('hour').toDate();

		onSelectDateTime(dateWithTime);
	}

	return (
		<Container isTimePickerOpen={isDateSelected}>
			<Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

			{isDateSelected && (
				<TimePicker>
					<TimePickerHeader>
						{weekDay} <span>{decribedDay}</span>
					</TimePickerHeader>

					<TimePickerList>
						{availability?.possibleTimes.map((hour) => {
							return (
								<TimePickerItem key={hour} disabled={!availability.availableTimes.includes(hour)} onClick={() => handleSelectTime(hour)}>
									{String(hour).padStart(2, '0')}:00h
								</TimePickerItem>
							);
						})}
					</TimePickerList>
				</TimePicker>
			)}
		</Container>
	);
}
