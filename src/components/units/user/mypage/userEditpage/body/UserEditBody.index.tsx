import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "antd";
import { useForm } from "react-hook-form";
import { wrapFormAsync } from "../../../../../../commons/libraries/asyncFunc";
import { userEditSchema } from "../../../../../../commons/validations/validation";
import MyDropzone from "../../../../../commons/hooks/customs/useDropzone";
import { useMutationUpdateLoginUser } from "../../../../../commons/hooks/mutations/useMutationUpdateLoginUser";
import { useQueryFetchLoginUser } from "../../../../../commons/hooks/queries/useQueryFetchLoginUser";
import * as S from "./UserEditBody.styles";
import { useDropzone } from "react-dropzone";
import { filesState, imageUrlsState } from "../../../../../../commons/stores";
import { useRecoilState } from "recoil";

interface IFormUpdateData {
  password: string;
  phoneNumber: string;
  email: string;
  name: string;
}

export default function UserEditBody(props): JSX.Element {
  // const [imageUrls, setImageUrls] = useRecoilState(imageUrlsState);
  // const [files, setFiles] = useRecoilState<File[]>(filesState);
  const [updateLoginUser] = useMutationUpdateLoginUser();
  const { data } = useQueryFetchLoginUser();
  const [getRootProps, getInputProps, , previewImagesJsonString] = MyDropzone();

  const { register, formState, handleSubmit } = useForm({
    resolver: yupResolver(userEditSchema),
    mode: "onChange",
  });

  console.log(formState);

  const onClickUserUpdate = async (data: IFormUpdateData) => {
    try {
      const result = await updateLoginUser({
        variables: {
          updateLoginUserInput: {
            password: data.password,
            phone: data.phoneNumber,
            name: data.name,
            email: data.email,
          },
        },
      });
      console.log(result);
      Modal.success({
        content: "회원수정 완료!",
      });
    } catch (error) {
      if (error instanceof Error)
        Modal.error({
          content: error.message,
        });
    }
  };
  console.log(previewImagesJsonString);

  return (
    <S.Wrapper>
      <S.ProfileImgBox {...getRootProps([])}>
        <input {...getInputProps()} />
        <S.ProfileImg src={JSON.parse(previewImagesJsonString)} />
        <S.ProfileImgEdit src="/user/mypage/edit/camera.png" />
        <MyDropzone />
      </S.ProfileImgBox>
      <S.InputForm>
        <S.EditList>
          <S.ListDetail>이름</S.ListDetail>
          <S.ReadOnlyDetailInput
            type="text"
            defaultValue={data?.fetchLoginUser.name}
            readOnly
          />
        </S.EditList>
        <S.EditList>
          <S.ListDetail>이메일</S.ListDetail>
          <S.ReadOnlyDetailInput
            type="text"
            defaultValue={data?.fetchLoginUser.email}
            readOnly
          />
        </S.EditList>
        <S.EditList>
          <S.ListDetail>비밀번호</S.ListDetail>
          <S.DetailInput
            type="password"
            placeholder="새로운 비밀번호를 입력해주세요."
            {...register("password")}
          />
        </S.EditList>
        <S.AlertMessage></S.AlertMessage>
        <S.EditList>
          <S.ListDetail>전화번호</S.ListDetail>
          <S.DetailInput
            style={{ color: "#4f4f4f" }}
            type="text"
            defaultValue={data?.fetchLoginUser.phone}
            {...register("phoneNumber")}
          />
        </S.EditList>
        <S.AlertMessage>{formState.errors.phoneNumber?.message}</S.AlertMessage>
      </S.InputForm>
      <S.BtnWrapper onSubmit={wrapFormAsync(handleSubmit(onClickUserUpdate))}>
        <S.EditBtn>수정하기</S.EditBtn>
        <S.DleteUserBtn type="button">탈퇴하기</S.DleteUserBtn>
      </S.BtnWrapper>
    </S.Wrapper>
  );
}
