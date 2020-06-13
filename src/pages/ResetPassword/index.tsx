import React, { useRef, useCallback } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, Content, Background, AnimatedContent } from './styles';

import getValidatoinErrors from '../../utils/getValidationErros';

import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const location = useLocation();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'As senhas devem ser iguais.'
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        await api.post('password/reset', {
          password: data.password,
          password_confirmation: data.password_confirmation,
          token,
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidatoinErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao resetar a senha',
          description:
            'Ocorreu um erro ao tentar resetar a senha, tente novamente.',
        });
      }
    },
    [addToast, history, location.search]
  );
  return (
    <Container>
      <Content>
        <AnimatedContent>
          <img src={logoImg} alt="Logo GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirme sua nova senha"
            />
            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimatedContent>
      </Content>

      <Background />
    </Container>
  );
};

export default ResetPassword;
