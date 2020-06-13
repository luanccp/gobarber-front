import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { Container, Content, Background, AnimatedContent } from './styles';

import { useAuth } from '../../hooks/auth';
import getValidatoinErrors from '../../utils/getValidationErros';

import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../hooks/toast';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um email válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        // recuperação de senha

        // history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidatoinErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar a recuperação de senha, tente novamente.',
        });
      }
    },
    [addToast]
  );
  return (
    <Container>
      <Content>
        <AnimatedContent>
          <img src={logoImg} alt="Logo GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperação de senha</h1>
            <Input name="email" icon={FiMail} placeholder="Email" />
            <Button type="submit">Recuperar minha senha</Button>
          </Form>
          <Link to="/signin">
            <FiLogIn size={16} />
            Voltar para Login
          </Link>
        </AnimatedContent>
      </Content>

      <Background />
    </Container>
  );
};

export default ForgotPassword;
