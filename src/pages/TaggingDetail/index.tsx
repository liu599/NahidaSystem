import {Button, CascaderProps, Col, Divider, Form, Row, Space, Tag, Typography} from 'antd';
import {useEffect, useState} from "react";
import {getCase, getTag, getTaggingSetting, taggingCase, updateCase} from "@/service/api.ts";
import {useNavigate, useSearchParams, Router} from "react-router-dom";
import {createTree, filterTreeByPaths, findSubarrays} from "@/utils";
import {Cascader} from "@formily/antd-v5";

const { Title, Paragraph, Text, Link } = Typography;

interface Option {
    value: string | number;
    label: string;
    children?: Option[];
    disableCheckbox?: boolean;
}

const Tagging =  () => {
    const [caseContent, setCaseContent] = useState({})
    const [currentTaggingTask, setCurrentTaggingTask] = useState({})
    const [parentTaggingTask, setParentTaggingTask] = useState({})
    const [tagGroupMap, setTagGroupMap] = useState({})
    const [allTags, setAllTags] = useState([])
    const [tagTree, setTagTree] = useState([])
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const taggingTaskId = params.get('tid')
    const taggingParentTaskId = params.get('pid')
    const caseId = params.get('cid')
    const [taggingOptions, setTaggingOptions] = useState([])
    const [currentTags, setCurrentTags] = useState({})
    const [nextCase, setNextCase] = useState(-1)
    const [prevCase, setPrevCase] = useState(-1)


    useEffect(() => {
        getTag({}, 1, 10000).then(r => {
            // console.log(r?.data?.data)
            setAllTags(r?.data?.data)
        })
        getCase({
            'id': parseInt(caseId, 10)
        }, 1, 1).then(r => {
            // console.log(r?.data?.data[0])
            const caseContent = r?.data?.data[0]

            // caseContent.tagIds = caseTagIds
            setCaseContent(caseContent)

        })
        getTaggingSetting({
            'id': parseInt(taggingTaskId, 10)
        }, 1, 1).then(r => {
            // console.log(r)
            setCurrentTaggingTask(r?.data?.data[0])
        }).then(r => {
            getTaggingSetting({
                'id': parseInt(taggingParentTaskId, 10)
            }, 1, 1).then(r => {
                // console.log(r?.data?.data[0])
                setParentTaggingTask(r?.data?.data[0])
            })
        })

    }, []);

    useEffect(() => {
        if (currentTaggingTask && currentTaggingTask.hasOwnProperty('taskContent')) {
            if (currentTaggingTask.taskContent === 'major task') {
                return
            }
            // console.log('currentTaggingTask', currentTaggingTask)
            currentTaggingTask.taskAll = JSON.parse(currentTaggingTask.taskContent)
            currentTaggingTask.taskIndex = currentTaggingTask.taskAll.indexOf(parseInt(caseId, 10))

            if (currentTaggingTask && currentTaggingTask.taskIndex && currentTaggingTask.taskIndex === currentTaggingTask.taskAll.length - 1) {
                setNextCase(-1)
                setPrevCase(currentTaggingTask.taskIndex - 1)
            } else if (currentTaggingTask.taskIndex === 0) {
                setNextCase(currentTaggingTask.taskIndex + 1)
                setPrevCase(-1)
            } else {
                setNextCase(currentTaggingTask.taskIndex + 1)
                setPrevCase(currentTaggingTask.taskIndex - 1)
            }
        }

    }, [currentTaggingTask]);

    useEffect(() => {
        // console.log('parentTaggingTask', parentTaggingTask)
        if (parentTaggingTask && parentTaggingTask.hasOwnProperty('option')) {
            const TaggingOptions = JSON.parse(parentTaggingTask.option)
            console.log(TaggingOptions)
            // 多选时ID为主ID但是后续选项其实不是选择了所有, 只是代表了出现的选项, 需要记忆主ID与后续的关系
            // 采用的办法是每个group存储一个map记忆主id与所有的选项的映射：
            const tagGroupMap = {}
            TaggingOptions.forEach(toption => {
                allTags.forEach(t => {
                    t.groupName = toption.tagGroupName
                })
                const tagTree = createTree(allTags)
                // const rawIds = flattenArr(toption.tagId)
                // toption.rawOptions = allTags.filter(t => rawIds.includes(t.id))
                // toption.optionTree = createTree(toption.rawOptions)
                console.log(toption.tagId)
                toption.optionTree = filterTreeByPaths(tagTree, toption.tagId)
                tagGroupMap[toption.tagGroupName] = toption.tagId
            })
            setTagGroupMap(tagGroupMap)
            const caseTagIds = caseContent.tags.filter((item, index) => {
                return !Object.values(tagGroupMap).flat(Infinity).includes(item.id)
            })
            setCurrentTags({
                originalTags: caseTagIds.map(item => [item.id]),
            })
            // console.log(TaggingOptions)
            setTaggingOptions(TaggingOptions)
        }
    }, [parentTaggingTask]);

    const onReset = () => {
        form.resetFields();
    };

    const onFill = () => {
        form.setFieldsValue({ note: 'Hello world!', gender: 'male' });
    };



    const onChange: CascaderProps<Option>['onChange'] = (value, selectedOptions) => {
        console.log('onChange')
        let tagMap = []
        if (!selectedOptions[0]) {
            const caseTagIds = caseContent.tags.filter((item, index) => {
                return !Object.values(tagGroupMap).flat(Infinity).includes(item.id)
            })
            setCurrentTags({
                originalTags: caseTagIds.map(item => [item.id]),
            })
            return
        }
        tagMap = tagGroupMap[selectedOptions[0][0].groupName]
        let currentTagMap = {}
        let readyToAdd = []
        for (let v of value) {
            if (findSubarrays(tagMap, v)[0]) {
                for(let r of findSubarrays(tagMap, v)) {
                    readyToAdd.push(r[r.length-1])
                }
            } else {
                readyToAdd.push(v[v.length-1])
            }
            // let lastElement = v[v.length - 1]
            // let lastTag = allTags.find(item => item.id === lastElement)
            // console.log(lastTag)
        }
        currentTagMap[selectedOptions[0][0].groupName] = readyToAdd
        setCurrentTags(Object.assign({}, currentTags, currentTagMap))
        // setTagsReadyToSubmit([...new Set([...currentTags, ...readyToAdd])])

    };

    const onSubmit = (clickType) => {
        const newTags = [...new Set([...Object.values(currentTags).flat(Infinity)])]
        console.log(currentTags)
        console.log(newTags)
        return
        updateCase(
          newTags,
          caseId
        ).then(() => {
            let nextId = 0

            let idx = currentTaggingTask.taskAll.indexOf(parseInt(caseId, 10))
            // if (idx === currentTaggingTask.taskAll.length - 1 || idx === 0) {
            //     return
            // }
            if (clickType === 'prev') {
                console.log(currentTaggingTask.taskAll[prevCase])
                nextId = currentTaggingTask.taskAll[idx-1]
            } else if (clickType === 'next') {
                console.log(nextCase)
                console.log(currentTaggingTask.taskAll[nextCase])
                nextId = currentTaggingTask.taskAll[idx+1]
            }
            taggingCase(
              caseId,
              taggingParentTaskId,
              taggingTaskId,
            ).then(() => {
                // window.location.replace(`/taggingDetail?tid=${taggingTaskId}&pid=${taggingParentTaskId}&cid=${nextId}`)
            })
            //

            // navigate(`/taggingDetail?tid=${taggingTaskId}&pid=${taggingParentTaskId}&cid=${nextId}`, {
            //     replace: true
            //     // state: {
            //     //     tid: taggingTaskId,
            //     //     pid: taggingParentTaskId,
            //     //     cid: nextId
            //     // }
            // })
        })
    }

    const intersectArrays = (arr1, arr2) => {
        // 创建一个 Set 来存储结果，保证唯一性
        const resultSet = new Set();

        // 遍历第一个数组中的每一个子数组
        arr1.forEach(subArr1 => {
            // 检查第二个数组中是否存在相同的子数组
            if (
              arr2.some(
                subArr2 => (JSON.stringify(subArr1) === JSON.stringify(subArr2))
              )
            ) {
                // 添加到结果集中
                resultSet.add(JSON.stringify(subArr1)); // 使用 JSON 字符串化来处理可能的顺序问题
            }
        });

        // 将 Set 转换回数组
        return Array.from(resultSet).map(str => JSON.parse(str));
    }


    const obtainCurrentTags = (tagGroupName) => {
        // console.log(tagGroupMap[tagGroupName])
        const myTags = caseContent.tags.reduce((acc, curr) => {
            const ilink = curr['indexLink'].split('-').filter(Boolean).map(item => parseInt(item, 10))
            acc.push(ilink)
            return acc
        }, [])
        // console.log(myTags)
        const myTagSelection = intersectArrays(tagGroupMap[tagGroupName], myTags)
        // console.log(myTagSelection)
        return myTagSelection
    }

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
                              defaultValue={obtainCurrentTags(item.tagGroupName)}
                              // options={options}
                              onChange={onChange}
                              multiple={item.multiple}
                              changeOnSelect
                              // maxTagCount="responsive"
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
        return (<div>
            <span>无法找到标注任务, 链接不正确...p_p....</span>
        </div>)
    }

    if (currentTaggingTask && currentTaggingTask.taskIndex === -1) {
        return (<div>
            <span>无法找到标注任务, 链接不正确...p_p....</span>
        </div>)
    }

    if (!caseContent) {
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
                    </Typography>
                </Col>
                <Col span={16} style={{paddingLeft: 100}}>
                    <Title level={5}>已有标签</Title>
                    <Paragraph>
                        {
                          caseContent.tags && caseContent.tags.map(item => {
                              const existingOptions = Object.values(tagGroupMap).flat(Infinity)
                              return !existingOptions.includes(item.id) ?
                                <Tag key={item.id}>
                                  {item.tagName}
                              </Tag> : null
                          })
                        }
                    </Paragraph>
                    <Title level={5}>标注标签</Title>
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
                                {
                                    prevCase !== -1 ? <Button type="primary" htmlType="submit" onClick={() => onSubmit('prev')} size="middle">
                                        上一条数据
                                    </Button> : null
                                }
                                {
                                    nextCase !== -1 ? <Button type="primary" htmlType="submit" onClick={() => onSubmit('next')}  size="middle">
                                        下一条数据
                                    </Button> : null
                                }
                                <Button htmlType="button" onClick={onReset} danger size="middle">
                                    重置
                                </Button>
                                {/*<Button type="link" htmlType="button" onClick={onFill} size="middle">*/}
                                {/*    (智能填充)*/}
                                {/*</Button>*/}
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
