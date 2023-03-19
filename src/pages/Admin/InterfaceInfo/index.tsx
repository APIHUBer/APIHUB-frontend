import CreateModal from '@/pages/Admin/InterfaceInfo/components/CreateModal';
import DeleteModal from '@/pages/Admin/InterfaceInfo/components/DeleteModal';
import UpdateModal from '@/pages/Admin/InterfaceInfo/components/UpdateModal';
import {
  addInterfaceInfoUsingPOST,
  deleteInterfaceInfoUsingPOST,
  listInterfaceInfoByPageUsingGET,
  offlineInterfaceInfoUsingPOST,
  onlineInterfaceInfoUsingPOST,
  updateInterfaceInfoUsingPOST,
} from '@/services/apihub-backend/interfaceInfoController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution delete window
   * @zh-CN 分布删除窗口的弹窗
   * */
  const [deleteModalOpen, handleDeleteModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfaceInfo[]>([]);

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在添加');
    try {
      await addInterfaceInfoUsingPOST({ ...fields });
      hide();
      message.success('Create successfully');
      actionRef.current?.reload();
      handleModalOpen(false);
      return true;
    } catch (error) {
      hide();
      message.error('Create failed, please try again!');
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.InterfaceInfo) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('Updating');
    try {
      await updateInterfaceInfoUsingPOST({ id: currentRow.id, ...fields });
      hide();

      message.success('Update successfully');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('Update failed!' + error.message);
      return false;
    }
  };

  /**
   *  Publish/online Interface
   * @zh-CN 发布接口
   *
   * @param record
   */
  const handleOnline = async (record: API.IdRequest) => {
    const hide = message.loading('Publishing');
    if (!record) return true;
    try {
      await onlineInterfaceInfoUsingPOST({
        id: record.id,
      });
      hide();
      message.success('Publish successfully');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('Publish failed!' + error.message);
      return false;
    }
  };

  /**
   *  Offline Interface
   * @zh-CN 下线接口
   *
   * @param record
   */
  const handleOffline = async (record: API.IdRequest) => {
    const hide = message.loading('Offlining');
    if (!record) return true;
    try {
      await offlineInterfaceInfoUsingPOST({
        id: record.id,
      });
      hide();
      message.success('Offline successfully');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('Offline failed!' + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param record
   */
  const handleRemove = async () => {
    const hide = message.loading('Deleting');
    if (!currentRow?.id) return true;
    try {
      await deleteInterfaceInfoUsingPOST({
        id: currentRow?.id,
      });
      hide();
      message.success('Deleted successfully');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('Delete failed!' + error.message);
      return false;
    }
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const valueEnum = {
    GET: { text: 'GET', status: 'GET' },
    POST: { text: 'POST', status: 'POST' },
    PUT: { text: 'PUT', status: 'PUT' },
    DELETE: { text: 'DELETE', status: 'DELETE' },
  };

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'index',
      hideInTable: true,
    },
    {
      title: 'Interface Name',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: 'Method',
      dataIndex: 'method',
      valueType: 'radioButton',
      width: 100,
      valueEnum,
    },
    {
      title: 'url',
      dataIndex: 'url',
      valueType: 'text',
    },
    {
      title: 'Request Parameters',
      dataIndex: 'requestParams',
      valueType: 'jsonCode',
    },
    {
      title: 'Request Header',
      dataIndex: 'requestHeader',
      valueType: 'jsonCode',
    },
    {
      title: 'Response Header',
      dataIndex: 'responseHeader',
      valueType: 'jsonCode',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '',
          status: 'Error',
        },
        1: {
          text: '',
          status: 'Success',
        },
      },
      align: 'center',
      width: 100,
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: 'Update Time',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 260,
      render: (_, record) => [
        <Button
          type="default"
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.update" defaultMessage="Update" />
        </Button>,
        record.status === 0 ? (
          <Button
            type="primary"
            key="config"
            onClick={() => {
              handleOnline(record);
            }}
          >
            <FormattedMessage id="pages.searchTable.online" defaultMessage="Publish" />
          </Button>
        ) : (
          <Button
            type="primary"
            key="config"
            danger
            onClick={() => {
              handleOffline(record);
            }}
          >
            <FormattedMessage id="pages.searchTable.offline" defaultMessage="Offline" />
          </Button>
        ),
        <Button
          type="primary"
          key="config"
          danger
          onClick={() => {
            // handleRemove(record);
            handleDeleteModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.delete" defaultMessage="Delete" />
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={async (
          params: U & {
            pageSize?: number;
            current?: number;
            keyword?: string;
          },
          sort: Record<string, SortOrder>,
          filter: Record<string, (string | number)[] | null>,
        ) => {
          const res: any = await listInterfaceInfoByPageUsingGET({ ...params });
          if (res?.data) {
            return {
              data: res.data.records || [],
              success: true,
              total: res?.data.total || 0,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        scroll={{ x: 1500 }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      <CreateModal
        columns={columns}
        onCancel={() => {
          handleModalOpen(false);
        }}
        onSubmit={(values) => {
          handleAdd(values);
        }}
        visible={createModalOpen}
      />
      <DeleteModal
        open={deleteModalOpen}
        onCancel={() => {
          handleDeleteModalOpen(false);
        }}
        onOk={() => {
          handleRemove();
          handleDeleteModalOpen(false);
        }}
      />
    </PageContainer>
  );
};

export default TableList;
