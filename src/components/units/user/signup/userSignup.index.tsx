import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "antd";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { wrapFormAsync } from "../../../../commons/libraries/asyncFunc";
import { signUpSchema } from "../../../../commons/validations/validation";
import { useMutationCreateUser } from "../../../commons/hooks/mutations/useMutationCreateUser";
import * as S from "./userSignup.style";

interface IFormData {
  name: string;
  password: string;
  email: string;
  confirmPw: string;
  phone: string;
}

export default function UserSignUpPage(): JSX.Element {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<IFormData>({
    resolver: yupResolver(signUpSchema),
    mode: "onChange",
  });

  const [createUser] = useMutationCreateUser();

  const onClickSingUp = async (data: IFormData): Promise<void> => {
    try {
      const result = await createUser({
        variables: {
          createUserInput: {
            email: data.email,
            name: data.name,
            password: data.password,
            phone: data.phone,
          },
        },
      });
      console.log(result);
    } catch (error) {
      if (error instanceof Error)
        Modal.error({
          content: error.message,
        });
      return;
    }

    Modal.success({
      content: "회원가입이 완료되었습니다. 로그인해주세요!",
    });
    void router.push("/user/login"); // 로그인이 된 상태로 로그인 페이지 이동함.
    console.log(data);
  };
  return (
    <>
      <S.Wrapper>
        <S.LogInWrapper>
          <S.LogInTitle>어디스카 회원이신가요?</S.LogInTitle>
          <S.LogInButton type="button">LOGIN</S.LogInButton>
        </S.LogInWrapper>
        <S.SignUpWrapper>
          <S.SignUpWrapperContainer
            onSubmit={wrapFormAsync(handleSubmit(onClickSingUp))}
          >
            <S.SignUpTitle>SIGN UP</S.SignUpTitle>
            <S.InputContainer>
              <S.SignUpInputBox>
                <S.SignUpInputTitle>Name</S.SignUpInputTitle>
                <S.SignUpInput
                  type="text"
                  {...register("name")}
                  placeholder="이름"
                ></S.SignUpInput>
              </S.SignUpInputBox>
              <S.ErrorMessage>{formState.errors.name?.message}</S.ErrorMessage>
              <S.SignUpInputBox>
                <S.SignUpInputTitle>Email</S.SignUpInputTitle>
                <S.SignUpInput
                  type="text"
                  {...register("email")}
                  placeholder="user@google.com"
                ></S.SignUpInput>
              </S.SignUpInputBox>
              <S.ErrorMessage>{formState.errors.email?.message}</S.ErrorMessage>
              <S.SignUpInputBox>
                <S.SignUpInputTitle>Password</S.SignUpInputTitle>
                <S.SignUpInput
                  {...register("password")}
                  type="password"
                ></S.SignUpInput>
              </S.SignUpInputBox>
              <S.ErrorMessage>
                {formState.errors.password?.message}
              </S.ErrorMessage>
              <S.SignUpInputBox>
                <S.SignUpInputTitle>Confirm Password</S.SignUpInputTitle>
                <S.SignUpInput
                  {...register("confirmPw")}
                  type="password"
                ></S.SignUpInput>
              </S.SignUpInputBox>
              <S.ErrorMessage>
                {formState.errors.confirmPw?.message}
              </S.ErrorMessage>
              <S.SignUpInputBox>
                <S.SignUpInputTitle>Phone</S.SignUpInputTitle>
                <S.SignUpInputPhone
                  {...register("phone")}
                  placeholder="010-1234-5678"
                ></S.SignUpInputPhone>
                <S.PhoneButton type="button">CLICK</S.PhoneButton>
              </S.SignUpInputBox>
              <S.ErrorMessage>{formState.errors.phone?.message}</S.ErrorMessage>
            </S.InputContainer>
            <S.ButtonContainer>
              <S.CancelButton type="button">CANCEL</S.CancelButton>
              <S.SignUpButton>SIGN UP</S.SignUpButton>
            </S.ButtonContainer>
          </S.SignUpWrapperContainer>
        </S.SignUpWrapper>
      </S.Wrapper>
    </>
  );
}
