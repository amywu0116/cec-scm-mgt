import styled from "styled-components";

import Modal from "@/components/Modal";

const Text = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

export default function ModalLoading(props) {
  const { open, onCancel } = props;

  return (
    <Modal
      className="modal-loading"
      centered
      destroyOnClose
      closable={false}
      width={400}
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Text>檔案上傳中，請勿執行其他動作...</Text>
    </Modal>
  );
}
