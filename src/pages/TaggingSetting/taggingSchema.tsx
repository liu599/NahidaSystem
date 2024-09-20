import { ISchema } from '@formily/react'
export const schema: ISchema = {
  type: 'object',
  properties: {
    grid: {
      type: 'void',
      'x-component': 'FormGrid',
      'x-component-props': {
        minColumns: 2,
        maxColumns: 2
      },
      properties: {
        suiteId: {
          type: 'string',
          title: '待标注测试集',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-validator': [{ required: true, message: '请输入计划名称' }],
        },
        numberOfCase: {
          type: 'string',
          title: '测试案例数量',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-validator': [{ required: true, message: '请输入计划名称' }],
        },
        taggingTaskName: {
          type: 'string',
          title: '标注任务名称',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-validator': [{ required: true, message: '请输入计划名称' }],
        },
        numberOfPerson: {
          type: 'string',
          title: '标注人数',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          required: true,
        },
      }
    },
    option: {
      type: 'array',
      'x-component': 'ArrayItems',
      'x-decorator': 'FormItem',
      maxItems: 20,
      title: '标签组配置',
      required: true,
      'x-component-props': { style: { maxWidth: '100%', minWidth: '480px' } },
      items: {
        type: 'object',
        'x-decorator': 'ArrayItems.Item',
        properties: {
          left: {
            type: 'void',
            'x-component': 'Space',
            properties: {
              sort: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems.SortHandle',
              },
            },
          },
          tagId: {
            type: 'string',
            title: '标签范围',
            enum: [
              { label: '敏感词测试集', value: 1 },
              { label: '车书测试集', value: 2 },
              { label: '旅医项目配置', value: 3 },
              { label: '验证测试集', value: 4 },
            ],
            'x-validator': [{ required: true, message: '标签组选择范围' }],
            'x-decorator': 'FormItem',
            'x-component': 'Cascader',
            'x-component-props': {
              expandTrigger: 'hover',
              allowClear: true,
              maxTagTextLength: 12,
              showSearch: true,
              multiple: true,
              style: {
                width: 240,
              },
            },
          },
          tagGroupName: {
            type: 'string',
            title: '展示组名称',
            'x-validator': [{ required: true, message: '请输入组名' }],
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              style: {
                width: 240,
              },
            },
          },
          right: {
            type: 'void',
            'x-component': 'Space',
            properties: {
              remove: {
                type: 'void',
                'x-component': 'ArrayItems.Remove',
              },
            },
          },
        },
      },
      properties: {
        addition: {
          type: 'void',
          title: '添加条目',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
  },
}
