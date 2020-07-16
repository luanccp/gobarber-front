import React, { useState, useCallback } from 'react';

import { FiPower, FiClock } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Calendar,
  Appointment,
  Section,
} from './styles';

import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="Logo Gobarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />

            <div>
              <span>Bem vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            <span>Hoje</span>
            <span>Dia 6</span>
            <span>Segunda feira</span>
          </p>

          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img
                src="https://avatars2.githubusercontent.com/u/5036316?s=460&u=f7ee9461dadfe6096d2cd7834a7ab80edded4587&v=4"
                alt="Elias Junior"
              />

              <strong>Elias Junior</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>

          <Section>
            <strong>Manhã</strong>
            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img
                  src="https://avatars2.githubusercontent.com/u/5036316?s=460&u=f7ee9461dadfe6096d2cd7834a7ab80edded4587&v=4"
                  alt="Elias Junior"
                />

                <strong>Elias Junior</strong>
              </div>
            </Appointment>
          </Section>

          <Section>
            <strong>Tarde</strong>
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onDayClick={handleDateChange}
            selectedDays={selectedDate}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
