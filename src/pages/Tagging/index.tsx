import {getTaggingSetting} from '@/service/api'
import {ActionType, ProColumns, ProTable, TableDropdown} from '@ant-design/pro-components'
import {ArrayItems, DatePicker, Editable, FormItem, Input, Radio, Select, Space, Switch,} from '@formily/antd-v5'
import {createSchemaField} from '@formily/react'
import {useEffect, useRef, useState} from 'react'

const SchemaField = createSchemaField({
    components: {
        FormItem,
        Editable,
        DatePicker,
        Space,
        Radio,
        Input,
        Select,
        ArrayItems,
        Switch,
    },
})

export type TaggingTaskItem = {
    createdAt: number
    taskStatus: string
    waiting: string
    total: string
    completed: string
    option: string
    suiteId: number
    taskId: number
    taskName: string
    id: number
}

const DataTagging = () => {
    const [loading, setLoading] = useState(false)
    const [showDetail, setShowDetail] = useState<boolean>(false)
    const actionRef = useRef<ActionType>()
    const [currentRow, setCurrentRow] = useState<any>()
    const [taggingTasks, setTaggingTasks] = useState([])
    const columnsDef: ProColumns<TaggingTaskItem>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            // valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '标注任务名称',
            dataIndex: 'taskName',
            // valueType: 'indexBorder',
            width: 120,
        },
        {
            title: '标注任务状态',
            dataIndex: 'taskStatus',
            // valueType: 'indexBorder',
            width: 120,
        },
        {
            title: '测试集ID',
            dataIndex: 'suiteId',
            // valueType: 'indexBorder',
            width: 120,
        },
        {
            title: '大模型任务ID',
            dataIndex: 'taskId',
            // valueType: 'indexBorder',
            width: 120,
        },
        {
            title: '完成数量',
            dataIndex: 'waiting',
            tooltip: '红色: 未完成, 绿色: 已完成, 黑色: 总数',
            // valueType: 'indexBorder',
            hideInSearch: true,
            width: 120,
            render: (_, entity) => (
              <Space>
                  <span style={{color: "red", fontWeight: 700}}>{entity.waiting}</span> |
                  <span style={{color: "green", fontWeight: 700}}>{entity.completed}</span> |
                  <span style={{fontWeight: 700}}>{entity.total}</span>
              </Space>
            )
        },
        {
            title: '操作',
            width: 180,
            key: 'option',
            valueType: 'option',
            render: (_, entity) => [
                <a
                  key="link"
                  onClick={() => {
                      setCurrentRow(entity)
                      setShowDetail(true)
                  }}
                >
                    更新
                </a>,
                <a key="link2">停止</a>,
                <a key="link3">复制</a>,
                <TableDropdown
                  key="actionGroup"
                  menus={[
                    { key: 'copy', name: '复制' },
                  ]}
                />,
            ],
        },
    ]

    useEffect(() => {
        getTaggingSetting({}, 1, 1000).then((res) => {
            console.log(res)
            setTaggingTasks(res.data?.data)
        })
    }, [])


    return (
      <div>
          <ProTable<TaggingTaskItem>
            actionRef={actionRef}
            columns={columnsDef}
            request={(params, sorter, filter) => {
                // 表单搜索项会从 params 传入，传递给后端接口。
                console.log(params, sorter, filter)
                // if (params && params['planStatus'] == 'offline') {
                //     // @ts-ignore
                //     params.enabled = 0
                // } else if (params && params['planStatus'] == 'online') {
                //     params.enabled = 1
                // }
                // if (params?.projectStr) {
                //     params['project_id'] = params?.projectStr
                // }
                // if (params && params['name']) {
                //     params['task_group_name'] = params['name']
                // }
                // Object.keys(params).forEach((k) => {
                //     if (!params[k]) {
                //         delete params[k]
                //     }
                // })
                //
                return getTaggingSetting(params, params?.current,
                  20).then((r) => {
                    const response_data = r.data.data
                    response_data.forEach((item: any) => {
                        item.key = item.id
                    })
                    console.log(response_data, 'item data')
                    return {
                        data: response_data,
                        success: true,
                        total: r.data.pager.total,
                    }
                })
            }}
            rowKey="key"
            pagination={{
                showQuickJumper: true,
            }}
            search={{
                layout: 'vertical',
                defaultCollapsed: true,
            }}
            dateFormatter="string"
            toolbar={{
                title: '标注任务',
                // tooltip: '测试计划',
            }}
            toolBarRender={(_, rows) => [
                // <Button key="show">查看日志</Button>,
                // <Button type="primary" key="primary" onClick={(e) => setShowDetail(true)}>
                //     创建标注任务
                // </Button>,

                // <Dropdown
                //   key="menu"
                //   menu={{
                //     items: [
                //       {
                //         label: '1st item',
                //         key: '1',
                //         onClick: (data) => {
                //           console.log(data)
                //         },
                //       },
                //       {
                //         label: '2nd item',
                //         key: '2',
                //       },
                //       {
                //         label: '3rd item',
                //         key: '3',
                //       },
                //     ],
                //   }}
                // >
                //   <Button>
                //     <EllipsisOutlined />
                //   </Button>
                // </Dropdown>,
            ]}
          />
      </div>
    )
}

export default DataTagging
