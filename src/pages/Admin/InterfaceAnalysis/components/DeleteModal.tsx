import { Props } from '@/pages/Admin/InterfaceInfo/components/UpdateModal';
import { Modal } from 'antd';
import React, { useState } from 'react';

const DeleteModal: React.FC<Props> = (props) => {
  const { open, onCancel, onOk } = props;
  // const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  return (
    <Modal
      title="Do you want to delete these interface?"
      open={open}
      onOk={onOk}
      okType="danger"
      confirmLoading={confirmLoading}
      onCancel={() => onCancel?.()}
    ></Modal>
  );
};

export default DeleteModal;
