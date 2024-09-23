import {Button, Col, Divider, Form, Row, Select, Space, Tag, Typography} from 'antd';
import {useEffect, useState} from "react";
import {getCase, getTag, getTaggingSetting} from "@/service/api.ts";
import {useNavigate, useSearchParams} from "react-router-dom";
import {createTree, flattenArr} from "@/utils";
import {Cascader} from "@formily/antd-v5";
const { Title, Paragraph, Text, Link } = Typography;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};



const data = [
    {
        label: "标签组1",
        type: "multiple",
        options: [
            {
                value: "标签1",
                label: <span>标签1</span>
            },
            {
                value: "标签2",
                label: <span>标签2</span>
            }
        ]
    },
    {
        label: "标签组2",
        type: "multiple",
        options: [
            {
                value: "标签3",
                label: <span>标签3</span>
            },
            {
                value: "标签4",
                label: <span>标签4</span>
            }
        ]
    },
    {
        label: "标签组3",
        type: "single",
        options: [
            {
                value: "标签5",
                label: <span>标签5</span>
            },
            {
                value: "标签6",
                label: <span>标签6</span>
            }
        ]
    }
]

const Tagging =  () => {
    const [caseContent, setCaseContent] = useState({})
    const [currentTaggingTask, setCurrentTaggingTask] = useState({})
    const [parentTaggingTask, setParentTaggingTask] = useState({})
    const [allTags, setAllTags] = useState([])
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const taggingTaskId = params.get('tid')
    const taggingParentTaskId = params.get('pid')
    const caseId = params.get('cid')
    const [taggingOptions, setTaggingOptions] = useState([])


    useEffect(() => {
        getTag({}, 1, 10000).then(r => {
            // console.log(r?.data?.data)
            setAllTags(r?.data?.data)
        })
        getCase({
            'id': parseInt(caseId, 10)
        }, 1, 1).then(r => {
            console.log(r?.data?.data[0])
            const caseContent = r?.data?.data[0]
            // const caseTagIds = r?.data?.data[0].tags.map((item, index) => {
            //     return {
            //         key: index,
            //         id: item.id,
            //         tagName: item.tagName,
            //     }
            // })
            // caseContent.tagIds = caseTagIds
            setCaseContent(caseContent)
        })
        getTaggingSetting({
            'id': parseInt(taggingTaskId, 10)
        }, 1, 1).then(r => {
            console.log(r)
            setCurrentTaggingTask(r?.data?.data[0])
        }).then(r => {
            getTaggingSetting({
                'id': parseInt(taggingParentTaskId, 10)
            }, 1, 1).then(r => {
                console.log(r?.data?.data[0])
                setParentTaggingTask(r?.data?.data[0])
            })
        })

    }, []);

    useEffect(() => {
        console.log('currentTaggingTask', currentTaggingTask)
        if (currentTaggingTask.hasOwnProperty('taskContent')) {
            if (currentTaggingTask.taskContent === 'major task') {
                return
            }
            currentTaggingTask.taskAll = JSON.parse(currentTaggingTask.taskContent)
            currentTaggingTask.taskIndex = currentTaggingTask.taskAll.indexOf(parseInt(caseId, 10))
        }


    }, [currentTaggingTask]);

    useEffect(() => {
        console.log('parentTaggingTask', parentTaggingTask)
        if (parentTaggingTask.hasOwnProperty('option')) {
            const TaggingOptions = JSON.parse(parentTaggingTask.option)

            TaggingOptions.forEach(toption => {
                const rawIds = flattenArr(toption.tagId)
                toption.rawOptions = allTags.filter(t => rawIds.includes(t.id))
                toption.optionTree = createTree(toption.rawOptions)
            })
            console.log(TaggingOptions)
            setTaggingOptions(TaggingOptions)
        }
    }, [parentTaggingTask]);

    const onReset = () => {
        form.resetFields();
    };

    const onFill = () => {
        form.setFieldsValue({ note: 'Hello world!', gender: 'male' });
    };

    const generateOption = (data, chunkSize = 2) => {
        const chunks = [];
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            chunks.push(
              <Row key={`row-${i}`}>
                  {chunk.map((item, index) => (
                    <Col span={12} key={`item-${item.tagGroupName}`}>
                        <Form.Item
                          name={`item-${item.tagGroupName}-${i}`}
                          label={item.tagGroupName}
                          rules={[{ required: true, message: '数据校验失败, 请打标签', type: item.type === 'single' ? 'string' : 'array' }]}
                        >
                            <Cascader
                              style={{ width: '100%' }}
                              options={item.optionTree}
                              // onChange={onChange}
                              multiple
                              changeOnSelect
                              maxTagCount="responsive"
                            />
                            {/*<Select*/}
                            {/*  mode={item.type === 'single' ? undefined : 'tags'}*/}
                            {/*  options={item.options}*/}
                            {/*  placeholder="请选择标签"*/}
                            {/*/>*/}
                        </Form.Item>
                    </Col>
                  ))}
              </Row>
            );
        }
        return chunks
    }





    if (!parentTaggingTask) {
        console.log('parentTaggingTask', parentTaggingTask)
        return <div>loading..</div>
    }

    if (currentTaggingTask && currentTaggingTask.taskIndex === -1) {
        return (<div>
            <span>无法找到标注任务, 链接不正确...p_p....</span>
        </div>)
    }

    return (
        <div style={{maxWidth: "1280px", margin: "0 auto", minHeight: "100vh"}}>
            <Divider orientation="left" orientationMargin="0" style={{  borderColor: '#7cb305' }}>
                待标注内容
            </Divider>
            <Row>
                <Col span={24}>
                    <Typography>
                        <Space>
                            <Text type="secondary">第 {currentTaggingTask.taskIndex + 1}  / {currentTaggingTask.total} 测试案例</Text>
                            <Text type="secondary">任务 {parentTaggingTask.taskName}</Text>
                        </Space>
                    </Typography>
                </Col>
            </Row>
            <Row style={{marginBottom: "32px", minHeight: "300px", padding: "24px"}}>
                <Col span={8}>
                    <Typography>
                        <Title level={5}>问题</Title>
                        <Paragraph>
                            {caseContent.content}
                        </Paragraph>
                        <Title level={5}>期望回答</Title>
                        <Paragraph>
                            {caseContent.answer}
                        </Paragraph>
                        <Paragraph>
                            {
                                caseContent.tags && caseContent.tags.map(item => {
                                    return  <Tag key={item.id}>
                                        {item.tagName}
                                    </Tag>
                                })
                            }
                        </Paragraph>

                    </Typography>
                </Col>
                <Col span={16}>
                    <Form
                      name="validate_other"
                      form={form}
                      style={{ maxWidth: '100%', width: '100%', marginBottom: '60px' }}
                    >
                        {
                            generateOption(taggingOptions, 1)
                        }
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Row style={{textAlign: "center"}}>
                        <Col span={24}>
                            <Space size="large">
                                <Button htmlType="button" onClick={onReset} danger size="middle">
                                    重置
                                </Button>
                                <Button type="primary" htmlType="submit" size="middle">
                                    上一条数据
                                </Button>
                                <Button type="primary" htmlType="submit" size="middle">
                                    下一条数据
                                </Button>
                                <Button type="link" htmlType="button" onClick={onFill} size="middle">
                                    (智能填充)
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Col>
            </Row>


        </div>
    )
}

export default () => {
    return (
        <Tagging/>
    )
}
