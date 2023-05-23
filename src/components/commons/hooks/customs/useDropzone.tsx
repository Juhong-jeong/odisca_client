import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRecoilState } from "recoil";
import { imageUrlsState } from "../../../../commons/stores";
import * as D from "../../../units/user/mypage/userEditpage/body/UserEditBody.styles";
import { useQueryFetchLoginUser } from "../queries/useQueryFetchLoginUser";

interface MyDropzoneProps {
  onFilesChange: (selectedFiles: File[]) => void;
}

function MyDropzone({ onFilesChange }: MyDropzoneProps): JSX.Element {
  const [imageUrls, setImageUrls] = useRecoilState(imageUrlsState);
  const { data } = useQueryFetchLoginUser();

  const [imageDataArray, setImageDataArray] = useState([]);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = reader.result;
        setImageDataArray((prevImageDataArray) => [
          ...prevImageDataArray,
          arrayBuffer,
        ]);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    const updatedImageUrls = imageDataArray.map((imageData, index) =>
      URL.createObjectURL(new Blob([imageData]))
    );

    // Recoil 상태 업데이트
    setImageUrls(updatedImageUrls);
  }, [imageDataArray, setImageUrls, onFilesChange]);
  const previewImagesJsonString = JSON.stringify(imageUrls);

  console.log(data?.fetchLoginUser.user_image, "dddddd");
  return (
    <>
      <D.ProfileImgBox {...getRootProps()}>
        <input {...getInputProps()} />
        <D.ProfileImgEdit src="/user/mypage/edit/camera.png" />
        <D.ProfileImg
          // src={
          //   data?.fetchLoginUser.user_image
          //     ? `https://storage.googleapis.com/${data.fetchLoginUser.user_image}`
          //     : JSON.parse(previewImagesJsonString)
          // }
          src={JSON.parse(previewImagesJsonString)}
        ></D.ProfileImg>
      </D.ProfileImgBox>
      {/* <D.ProfileImg src={JSON.parse(previewImagesJsonString)}></D.ProfileImg> */}
    </>
  );
}
export default MyDropzone;
