import {getTaggingSetting} from '@/service/api'
import {ActionType, ProColumns, ProTable, TableDropdown} from '@ant-design/pro-components'
import {ArrayItems, DatePicker, Editable, FormItem, Input, Radio, Select, Space, Switch,} from '@formily/antd-v5'
import {createSchemaField} from '@formily/react'
import {useEffect, useRef, useState} from 'react'
import {Progress, Tag, Tooltip} from "antd";

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

const colorTagMapping = {
    '等待标注': '#108ee9',
    '标注进行中': 'geekblue',
    '标注完成': '#87d068'
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
            render: (_, entity) => (
              <Tag color={colorTagMapping[entity.taskStatus]}>{entity.taskStatus}</Tag>
            )
        },
        {
            title: '测试集ID',
            dataIndex: 'suiteId',
            tooltip: '括号内为待标注的总数量',
            // valueType: 'indexBorder',
            width: 120,
            render: (_, entity) => (
              <p>
                  {
                      entity.taskId === 0 ? <span>{entity.suiteId}({entity.total})</span> : <span>
                          测试集: {entity.suiteId}({entity.total})
                          测试任务: {entity.taskId}
                      </span>
                  }
              </p>
            )
        },
        {
            title: '标注进度',
            dataIndex: 'waiting',
            tooltip: '悬浮可以查看进度',
            // valueType: 'indexBorder',
            hideInSearch: true,
            width: 120,
            render: (_, entity) => (
              <Tooltip title={`已标注: ${entity.total - entity.waiting} / 未标注: ${entity.waiting}  / 总数: ${entity.total}`}>
                  <Progress
                    type="circle"
                    size={50}
                    percent={Math.ceil((entity.total - entity.waiting) / entity.total * 100)}
                    success={{ percent: Math.ceil((entity.total - entity.waiting) / entity.total * 100) }}
                  />
              </Tooltip>
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
                  disabled={entity.taskContent==='major task'}
                  onClick={() => {
                      console.log(entity)
                      const haveLabeledCase = JSON.parse(entity.option)
                      console.log(haveLabeledCase)
                      const notLabeledCase = JSON.parse(entity.taskContent)
                      console.log(notLabeledCase)
                      if (notLabeledCase.length > 0) {
                          const taskIndex = notLabeledCase.indexOf(haveLabeledCase[haveLabeledCase.length-1])
                          console.log(taskIndex)
                          const nextCase = notLabeledCase[taskIndex + 1]
                          window.location.replace(`/taggingDetail?tid=${entity.id}&pid=${entity.parentId}&cid=${nextCase}`)
                      }


                      setCurrentRow(entity)
                      setShowDetail(true)
                  }}
                >
                    标注
                </a>,
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
