import {
  ArrayItems,
  Cascader,
  DatePicker,
  Editable,
  Form, FormButtonGroup,
  FormGrid,
  FormItem,
  FormLayout,
  FormTab,
  Input,
  NumberPicker,
  Password,
  PreviewText,
  Select, Submit, Space,
  Switch,
  TimePicker,
  Upload,
} from '@formily/antd-v5'
import {useEffect, useMemo, useState} from "react";
import {createTaggingSetting, getCasesBySuite, getSuite, getTag, getTaggingSetting} from "@/service/api.ts";
import { schema } from './taggingSchema'
import {createForm, onFieldReact, onFormInit} from "@formily/core";
import {Button, Divider, Modal} from "antd";
import {createSchemaField, FormProvider} from "@formily/react";
import {useNavigate, useSearchParams} from 'react-router-dom'
import {divide} from "lodash-es";
const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    FormLayout,
    FormTab,
    Input,
    DatePicker,
    Upload,
    Cascader,
    Select,
    ArrayItems,
    Editable,
    Switch,
    Space,
    PreviewText,
    NumberPicker,
    Password,
    TimePicker,
  },
})

// http://localhost:9549/taggingSetting?sid=47&uid=247
const createTree = (arr) => {
  // 创建一个 Map 对象来存储 id 和对象的关系
  const map = new Map();
  const tree = [];

  // 遍历数组，将每个对象存储到 map 中，并设置它们的 children 属性为空数组
  arr.forEach(item => {
    item.value = item.id
    item.label = item.tagName
    map.set(item.id, {...item, children: []});
  });

  // 再次遍历数组，这次是为了建立父子关系
  arr.forEach(item => {
    // 如果 item 有 parentId，则将 item 添加到对应父项的 children 数组中
    if (item.parentId !== undefined && item.parentId !== null && item.parentId !== 0) {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children.push(map.get(item.id));
      }
    } else {
      // 如果没有 parentId，则认为是根节点，添加到 tree 中
      tree.push(map.get(item.id));
    }
  });

  return tree;
}

const TaggingSetting: React.FC =  () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [totalCase, setTotalCase] = useState(0)
  const [tags, setTags] = useState([])
  const [currentFormData, setCurrentFormData] = useState<any>()
  const sid = params.get('sid')
  const uid = params.get('uid')
  const tsid = params.get('tsid')
  const jobType = params.get('type')

  if (!sid || !uid) {
    return <div>该标注任务不存在</div>
  }

  const createTaggingTask = async () => {
    const values = await form.submit()
    const createRequest = {
      "taskName": values.taggingTaskName,
      "numberOfPerson": values.numberOfPerson,
      "taskId": 0,
      "suiteId": parseInt(sid, 10),
      "createUser": parseInt(uid, 10),
      "option": JSON.stringify(values.option)
    }
    console.log(values, createRequest, 'values')
    Modal.info({
      title: '创建标注任务提示',
      content: (
        <div>
          <p>你将创建标注任务, 目前此配置不支持修改。点击OK继续创建</p>
        </div>
      ),
      onOk() {
        createTaggingSetting(createRequest).then(r => {
          console.log(r)
          if (r && r.code === 20000) {
            navigate('/')
          }
        })
      },
    });

  }

  useEffect(() => {
    getTag({}, 1, 10000).then(r => {
      console.log(r?.data?.data)
      setTags(r?.data?.data)
    })
    getCasesBySuite(sid, 1, 1).then(r => {
      // console.log(r?.data?.pager?.total)
      setTotalCase(r?.data?.pager?.total)
    })
  }, []);

  const form = createForm({
      effects: () => {
        onFieldReact('test', (field) => {
          // console.log(field)
        })
        onFormInit((form: Form) => {
          // console.log('schema', schema)
          // console.log(sid)
          form.setInitialValues({
            'suiteId': sid,
            'numberOfCase': totalCase
          })
          // https://unpkg.com/china-location@2.1.0/dist/location.json cascade
          form.setFieldState('option.*.tagId', (state) => {
            const tagTree = createTree(tags)
            console.log(tagTree)
            state.dataSource = tagTree
          })
          form.setFieldState(
            '*(numberOfCase, suiteId)',
            (state) => {
              state.editable = false
            }
          )
        })
        // extraEffects()
      },
    })


  const handleSave = () => {

  }



  return (
    <div style={{maxWidth: "1100px", margin: "0 auto", paddingTop: 32, color: '#222'}}>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start">
          <div className="mr-2 h-5 w-1 bg-blue-400"></div>
          <div className="text-base font-bold">标注任务配置</div>
        </div>
        <div>
          <Button type="primary" onClick={createTaggingTask}>
            创建标注任务
          </Button>
        </div>
      </div>
      <Divider className="my-4"/>
      <FormProvider form={form} onAutoSubmit={console.log}>
        <SchemaField schema={schema}/>
      </FormProvider>
    </div>
  )
}

export default TaggingSetting