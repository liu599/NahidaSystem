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
import {useEffect, useMemo} from "react";
import {getTaggingSetting} from "@/service/api.ts";
import { schema } from './taggingSchema'
import {createForm, onFieldReact, onFormInit} from "@formily/core";
import {Button, Divider} from "antd";
import {createSchemaField, FormProvider} from "@formily/react";
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

export default () => {
  useEffect(() => {
    getTaggingSetting({}, 1, 20)
  }, []);

  const form = useMemo(() => {
    return createForm({
      effects: () => {
        onFieldReact('test', (field) => {
          console.log(field)
        })
        onFormInit((form: Form) => {
          console.log('schema', schema)
          form.setInitialValues({})
          form.setFieldState(
            '*',
            (state) => {
              // state.editable = false
            }
          )
        })
        // extraEffects()
      },
    })
  }, [schema])

  const handleSave = () => {

  }

  return (
    <div style={{maxWidth: "1100px", margin: "0 auto"}}>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start">
          <div className="mr-2 h-5 w-1 bg-blue-400"></div>
          <div className="text-base font-bold">标注任务配置</div>
        </div>
        <div>
          <Button type="primary" onClick={console.log}>
            保存设置
          </Button>
        </div>
      </div>
      <Divider className="my-4"/>
      <FormProvider form={form} onAutoSubmit={console.log}>
        <SchemaField schema={schema}/>
        <FormButtonGroup>
          <Submit onSubmit={console.log}>Submit</Submit>
        </FormButtonGroup>
      </FormProvider>
    </div>
  )
}
