const data = {
  code: 200,
  msg: '',
  data: {
    info: {
      id: '604f2fd944eddbc74057553d',
      name: '金融学研究基金',
      description: '金融学研究基金',
      type: {
        key: 'Task',
        value: '课题和项目',
      },
      scopes: [
        {
          key: 'School',
          value: '学院',
        },
        {
          key: 'Team',
          value: '研究中心',
        },
      ],
      action: {
        Team: [
          {
            key: 'Show',
            value: '查看',
          },
        ],
        School: [
          {
            key: 'Show',
            value: '查看',
          },
          {
            key: 'Save',
            value: '编辑',
          },
        ],
      },
      schema: {
        id: '604f2fd944eddbc74057553c',
        type: {
          key: 'Array',
          value: '数组',
        },
        name_field: 'project_name',
        fields: [
          {
            key: 'year',
            label: '年份',
            desc: '',
            type: {
              key: 'Object',
              value: '对象',
            },
            multiple: 0,
            default: null,
            components: [
              {
                key: 'year1',
                label: '年份',
                desc: '',
                type: {
                  key: 'String',
                  value: '文本',
                },
                multiple: 0,
                default: null,
                components: null,
                component: {
                  key: null,
                  type: {
                    key: 'DatePicker',
                    value: 'date-picker',
                  },
                  attribute: {
                    placeholder: '请选择年份',
                    disable: null,
                    visible: null,
                    maxlength: null,
                  },
                  parameter: {
                    formatter: 'YYYY',
                  },
                  default: null,
                  data_source: null,
                  trigger: {
                    key: 'OnChange',
                    value: '内容改变时',
                  },
                  has_other_input: null,
                  validation: [
                    {
                      type: {
                        key: 'Required',
                        value: '非空',
                      },
                      value: 1,
                      min: null,
                      max: null,
                      len: null,
                      message: '请选择年份',
                    },
                    {
                      type: {
                        key: 'Pattern',
                        value: '正则判断',
                      },
                      value: '^[0-9]{4}$',
                      min: null,
                      max: null,
                      len: null,
                      message: '年份格式错误',
                    },
                  ],
                  linkages: null,
                  formatter: {},
                  scene_layout: {
                    save: {
                      column_begin: 0,
                      column_length: 24,
                      column_max: 24,
                    },
                    show: {
                      column: 1,
                    },
                  },
                  skip: null,
                },
                link_to_subject: 0,
                duplicate_check: 0,
                is_active: 1,
              },
              {
                key: 'project_no1',
                label: '项目编号',
                desc: '按照项目在科研信息系统立项编号（若无，可不填）',
                type: {
                  key: 'String',
                  value: '文本',
                },
                multiple: 0,
                default: null,
                components: null,
                component: {
                  key: null,
                  type: {
                    key: 'Input',
                    value: 'input',
                  },
                  attribute: {
                    placeholder: '请填写项目编号',
                    disable: null,
                    visible: null,
                    maxlength: 32,
                  },
                  parameter: {},
                  default: null,
                  data_source: null,
                  trigger: {
                    key: 'OnBlur',
                    value: '组件失焦时',
                  },
                  has_other_input: null,
                  validation: [
                    {
                      type: {
                        key: 'Required',
                        value: '非空',
                      },
                      value: 1,
                      min: null,
                      max: null,
                      len: null,
                      message: '请填写项目编号',
                    },
                    {
                      type: {
                        key: 'Pattern',
                        value: '正则判断',
                      },
                      value: '^[0-9a-zA-Z\\-]{5,32}$',
                      min: null,
                      max: null,
                      len: null,
                      message: '项目编号格式错误',
                    },
                  ],
                  linkages: null,
                  formatter: {},
                  scene_layout: {
                    save: {
                      column_begin: 0,
                      column_length: 24,
                      column_max: 24,
                    },
                    show: {
                      column: 1,
                    },
                  },
                  skip: null,
                },
                link_to_subject: 0,
                duplicate_check: 0,
                is_active: 1,
              },
              {
                key: 'project_status1',
                label: '项目状态',
                desc: '在研;结题;审核中;未通过',
                type: {
                  key: 'String',
                  value: '文本',
                },
                multiple: 0,
                default: null,
                components: null,
                component: {
                  key: null,
                  type: {
                    key: 'Select',
                    value: 'select',
                  },
                  attribute: {
                    placeholder: '请选择项目状态',
                    disable: null,
                    visible: null,
                    maxlength: null,
                  },
                  parameter: {},
                  default: null,
                  data_source: {
                    type: {
                      key: 'Enum',
                      value: '枚举类型列表',
                    },
                    enum: [
                      {
                        key: 'Studying',
                        value: '在研',
                        data: null,
                      },
                      {
                        key: 'Conclusion',
                        value: '结题',
                        data: null,
                      },
                      {
                        key: 'Auditing',
                        value: '审核中',
                        data: null,
                      },
                      {
                        key: 'Failed',
                        value: '未通过',
                        data: null,
                      },
                    ],
                  },
                  trigger: {
                    key: 'OnChange',
                    value: '内容改变时',
                  },
                  has_other_input: null,
                  validation: [
                    {
                      type: {
                        key: 'Required',
                        value: '非空',
                      },
                      value: 1,
                      min: null,
                      max: null,
                      len: null,
                      message: '请选择项目状态',
                    },
                  ],
                  linkages: null,
                  formatter: {},
                  scene_layout: {
                    save: {
                      column_begin: 0,
                      column_length: 24,
                      column_max: 24,
                    },
                    show: {
                      column: 1,
                    },
                  },
                  skip: null,
                },
                link_to_subject: 0,
                duplicate_check: 0,
                is_active: 1,
              },
              {
                key: 'project_name1',
                label: '课题名称',
                desc: '',
                type: {
                  key: 'String',
                  value: '文本',
                },
                multiple: 0,
                default: null,
                components: null,
                component: {
                  key: null,
                  type: {
                    key: 'Input',
                    value: 'input',
                  },
                  attribute: {
                    placeholder: '请填写课题名称',
                    disable: null,
                    visible: null,
                    maxlength: 256,
                  },
                  parameter: {},
                  default: null,
                  data_source: null,
                  trigger: {
                    key: 'OnBlur',
                    value: '组件失焦时',
                  },
                  has_other_input: null,
                  validation: [
                    {
                      type: {
                        key: 'Required',
                        value: '非空',
                      },
                      value: 1,
                      min: null,
                      max: null,
                      len: null,
                      message: '请填写课题名称',
                    },
                  ],
                  linkages: null,
                  formatter: {},
                  scene_layout: {
                    save: {
                      column_begin: 0,
                      column_length: 24,
                      column_max: 24,
                    },
                    show: {
                      column: 1,
                    },
                  },
                  skip: null,
                },
                link_to_subject: 0,
                duplicate_check: 1,
                is_active: 1,
              },
              {
                key: 'author1',
                label: '全部作者',
                desc: '',
                type: {
                  key: 'Object',
                  value: '对象',
                },
                multiple: 1,
                default: null,
                components: null,
                component: {
                  key: null,
                  type: {
                    key: 'SelectTags',
                    value: 'select-tags',
                  },
                  attribute: {
                    placeholder: '请填写全部作者',
                    disable: null,
                    visible: null,
                    maxlength: 4,
                  },
                  parameter: {},
                  default: null,
                  data_source: {
                    type: {
                      key: 'UIMS_Users',
                      value: 'UIMS用户数据',
                    },
                  },
                  trigger: {
                    key: 'OnChange',
                    value: '内容改变时',
                  },
                  has_other_input: null,
                  validation: [
                    {
                      type: {
                        key: 'Required',
                        value: '非空',
                      },
                      value: 1,
                      min: null,
                      max: null,
                      len: null,
                      message: '请填写全部作者',
                    },
                  ],
                  linkages: null,
                  formatter: {
                    type: 'UIMS',
                  },
                  scene_layout: {
                    save: {
                      column_begin: 0,
                      column_length: 24,
                      column_max: 24,
                    },
                    show: {
                      column: 1,
                    },
                  },
                  skip: null,
                },
                link_to_subject: 1,
                duplicate_check: 0,
                is_active: 1,
              },
            ],
            component: {
              key: null,
              type: {
                key: null,
                value: 'date-picker',
              },
              attribute: null,
              parameter: null,
              default: null,
              data_source: null,
              trigger: null,
              has_other_input: null,
              validation: null,
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'project_no',
            label: '项目编号',
            desc: '按照项目在科研信息系统立项编号（若无，可不填）',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'Input',
                value: 'input',
              },
              attribute: {
                placeholder: '请填写项目编号',
                disable: null,
                visible: null,
                maxlength: 32,
              },
              parameter: {},
              default: null,
              data_source: null,
              trigger: {
                key: 'OnBlur',
                value: '组件失焦时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请填写项目编号',
                },
                {
                  type: {
                    key: 'Pattern',
                    value: '正则判断',
                  },
                  value: '^[0-9a-zA-Z\\-]{5,32}$',
                  min: null,
                  max: null,
                  len: null,
                  message: '项目编号格式错误',
                },
              ],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'project_status',
            label: '项目状态',
            desc: '在研;结题;审核中;未通过',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'Select',
                value: 'select',
              },
              attribute: {
                placeholder: '请选择项目状态',
                disable: null,
                visible: null,
                maxlength: null,
              },
              parameter: {},
              default: null,
              data_source: {
                type: {
                  key: 'Enum',
                  value: '枚举类型列表',
                },
                enum: [
                  {
                    key: 'Studying',
                    value: '在研',
                    data: null,
                  },
                  {
                    key: 'Conclusion',
                    value: '结题',
                    data: null,
                  },
                  {
                    key: 'Auditing',
                    value: '审核中',
                    data: null,
                  },
                  {
                    key: 'Failed',
                    value: '未通过',
                    data: null,
                  },
                ],
              },
              trigger: {
                key: 'OnChange',
                value: '内容改变时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请选择项目状态',
                },
              ],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'project_name',
            label: '课题名称',
            desc: '',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'Input',
                value: 'input',
              },
              attribute: {
                placeholder: '请填写课题名称',
                disable: null,
                visible: null,
                maxlength: 256,
              },
              parameter: {},
              default: null,
              data_source: null,
              trigger: {
                key: 'OnBlur',
                value: '组件失焦时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请填写课题名称',
                },
              ],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 1,
            is_active: 1,
          },
          {
            key: 'author',
            label: '全部作者',
            desc: '',
            type: {
              key: 'Object',
              value: '对象',
            },
            multiple: 1,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'SelectTags',
                value: 'select-tags',
              },
              attribute: {
                placeholder: '请填写全部作者',
                disable: null,
                visible: null,
                maxlength: 4,
              },
              parameter: {},
              default: null,
              data_source: {
                type: {
                  key: 'UIMS_Users',
                  value: 'UIMS用户数据',
                },
              },
              trigger: {
                key: 'OnChange',
                value: '内容改变时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请填写全部作者',
                },
              ],
              linkages: null,
              formatter: {
                type: 'UIMS',
              },
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 1,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'proposer',
            label: '申请人',
            desc: '',
            type: {
              key: 'Object',
              value: '对象',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'SelectTags',
                value: 'select-tags',
              },
              attribute: {
                placeholder: '请填写申请人',
                disable: null,
                visible: null,
                maxlength: 1,
              },
              parameter: {},
              default: null,
              data_source: {
                type: {
                  key: 'UIMS_Users',
                  value: 'UIMS用户数据',
                },
              },
              trigger: {
                key: 'OnChange',
                value: '内容改变时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请填写申请人',
                },
              ],
              linkages: null,
              formatter: {
                type: 'UIMS',
              },
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 1,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'proposer_frganizational',
            label: '申请人所在单位',
            desc: '',
            type: {
              key: 'Object',
              value: '对象',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'SelectTags',
                value: 'select-tags',
              },
              attribute: {
                placeholder: '请选择申请人所在单位',
                disable: null,
                visible: null,
                maxlength: 1,
              },
              parameter: {},
              default: null,
              data_source: {
                type: {
                  key: 'UIMS_Departments',
                  value: 'UIMS部门数据',
                },
              },
              trigger: {
                key: 'OnChange',
                value: '内容改变时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请选择申请人所在单位',
                },
              ],
              linkages: null,
              formatter: {
                type: 'UIMS',
              },
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 1,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'proposer_email',
            label: '申请人邮箱',
            desc: '',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'Input',
                value: 'input',
              },
              attribute: {
                placeholder: '请填写申请人邮箱',
                disable: null,
                visible: null,
                maxlength: 256,
              },
              parameter: {},
              default: null,
              data_source: null,
              trigger: {
                key: 'OnBlur',
                value: '组件失焦时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请填写申请人邮箱',
                },
                {
                  type: {
                    key: 'Pattern',
                    value: '正则判断',
                  },
                  value: '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$',
                  min: null,
                  max: null,
                  len: null,
                  message: '邮箱格式错误',
                },
              ],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'proposer_mobile',
            label: '申请人电话',
            desc: '',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'Input',
                value: 'input',
              },
              attribute: {
                placeholder: '请填写申请人电话',
                disable: null,
                visible: null,
                maxlength: 32,
              },
              parameter: {},
              default: null,
              data_source: null,
              trigger: {
                key: 'OnBlur',
                value: '组件失焦时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请填写申请人电话',
                },
                {
                  type: {
                    key: 'Pattern',
                    value: '正则判断',
                  },
                  value: '^\\+?[0-9]+[ \\-]?[0-9]+$',
                  min: null,
                  max: null,
                  len: null,
                  message: '邮箱格式错误',
                },
              ],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'school_contacts',
            label: '校内联系人',
            desc: '',
            type: {
              key: 'Object',
              value: '对象',
            },
            multiple: 1,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'SelectTags',
                value: 'select-tags',
              },
              attribute: {
                placeholder: '请填写校内联系人',
                disable: null,
                visible: null,
                maxlength: 1,
              },
              parameter: {},
              default: null,
              data_source: {
                type: {
                  key: 'UIMS_Users',
                  value: 'UIMS用户数据',
                },
              },
              trigger: {
                key: 'OnChange',
                value: '内容改变时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请填写校内联系人',
                },
              ],
              linkages: null,
              formatter: {
                type: 'UIMS',
              },
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 1,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'administrative_contacts',
            label: '行政对接人',
            desc: '',
            type: {
              key: 'Object',
              value: '对象',
            },
            multiple: 1,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'SelectTags',
                value: 'select-tags',
              },
              attribute: {
                placeholder: '请填写行政对接人',
                disable: null,
                visible: null,
                maxlength: 1,
              },
              parameter: {},
              default: null,
              data_source: {
                type: {
                  key: 'UIMS_Users',
                  value: 'UIMS用户数据',
                },
              },
              trigger: {
                key: 'OnChange',
                value: '内容改变时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请填写行政对接人',
                },
              ],
              linkages: null,
              formatter: {
                type: 'UIMS',
              },
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 1,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'apply_date',
            label: '申请日期',
            desc: '',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'DatePicker',
                value: 'date-picker',
              },
              attribute: {
                placeholder: '请选择申请日期',
                disable: null,
                visible: null,
                maxlength: null,
              },
              parameter: {
                formatter: 'YYYY/MM/DD',
              },
              default: null,
              data_source: null,
              trigger: {
                key: 'OnChange',
                value: '内容改变时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请选择申请日期',
                },
                {
                  type: {
                    key: 'Pattern',
                    value: '正则判断',
                  },
                  value: '^[0-9]{4}\\/[0-9]{2}\\/[0-9]{2}$',
                  min: null,
                  max: null,
                  len: null,
                  message: '日期格式错误',
                },
              ],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'project_create_date',
            label: '立项日期',
            desc: '项目在科研信息系统立项日期。注意填写格式',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'DatePicker',
                value: 'date-picker',
              },
              attribute: {
                placeholder: '请选择立项日期',
                disable: null,
                visible: null,
                maxlength: null,
              },
              parameter: {
                formatter: 'YYYY/MM/DD',
              },
              default: null,
              data_source: null,
              trigger: {
                key: 'OnChange',
                value: '内容改变时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请选择立项日期',
                },
                {
                  type: {
                    key: 'Pattern',
                    value: '正则判断',
                  },
                  value: '^[0-9]{4}\\/[0-9]{2}\\/[0-9]{2}$',
                  min: null,
                  max: null,
                  len: null,
                  message: '日期格式错误',
                },
              ],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'expiry_date',
            label: '研究期限',
            desc: '',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'DateRangePicker',
                value: 'date-range-picker',
              },
              attribute: {
                placeholder: '请选择研究期限',
                disable: null,
                visible: null,
                maxlength: null,
              },
              parameter: {
                formatter: 'YYYY/MM/DD',
              },
              default: null,
              data_source: null,
              trigger: {
                key: 'OnChange',
                value: '内容改变时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请选择研究期限',
                },
                {
                  type: {
                    key: 'Pattern',
                    value: '正则判断',
                  },
                  value: '^[0-9]{4}\\/[0-9]{2}\\/[0-9]{2} - [0-9]{4}\\/[0-9]{2}\\/[0-9]{2}$',
                  min: null,
                  max: null,
                  len: null,
                  message: '日期格式错误',
                },
              ],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'budget_money',
            label: '预算',
            desc: '',
            type: {
              key: 'Number',
              value: '数字',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'InputNumber',
                value: 'input-number',
              },
              attribute: {
                placeholder: '请填写预算',
                disable: null,
                visible: null,
                maxlength: 32,
              },
              parameter: {},
              default: null,
              data_source: null,
              trigger: {
                key: 'OnBlur',
                value: '组件失焦时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请填写预算',
                },
                {
                  type: {
                    key: 'Pattern',
                    value: '正则判断',
                  },
                  value: '^[0-9]+(\\.[0-9]{1,3})?$',
                  min: null,
                  max: null,
                  len: null,
                  message: '预算格式错误',
                },
              ],
              linkages: null,
              formatter: {
                type: 'money',
              },
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'category_type',
            label: '类别',
            desc: '',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'Select',
                value: 'select',
              },
              attribute: {
                placeholder: '请选择类别',
                disable: null,
                visible: null,
                maxlength: null,
              },
              parameter: {},
              default: null,
              data_source: {
                type: {
                  key: 'Enum',
                  value: '枚举类型列表',
                },
                enum: [
                  {
                    key: 'T1',
                    value: '重点',
                    data: null,
                  },
                  {
                    key: 'T2',
                    value: '一般',
                    data: null,
                  },
                ],
              },
              trigger: {
                key: 'OnChange',
                value: '内容改变时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请选择类别',
                },
              ],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'project_end_date',
            label: '结题日期',
            desc: '',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'DatePicker',
                value: 'date-picker',
              },
              attribute: {
                placeholder: '请选择结题日期',
                disable: null,
                visible: null,
                maxlength: null,
              },
              parameter: {
                formatter: 'YYYY/MM/DD',
              },
              default: null,
              data_source: null,
              trigger: {
                key: 'OnChange',
                value: '内容改变时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请选择结题日期',
                },
                {
                  type: {
                    key: 'Pattern',
                    value: '正则判断',
                  },
                  value: '^[0-9]{4}\\/[0-9]{2}\\/[0-9]{2}$',
                  min: null,
                  max: null,
                  len: null,
                  message: '日期格式错误',
                },
              ],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'examine_level',
            label: '考核等级',
            desc: '',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'Select',
                value: 'select',
              },
              attribute: {
                placeholder: '请选择考核等级',
                disable: null,
                visible: null,
                maxlength: null,
              },
              parameter: {},
              default: null,
              data_source: {
                type: {
                  key: 'Enum',
                  value: '枚举类型列表',
                },
                enum: [
                  {
                    key: 'T1',
                    value: 'A',
                    data: null,
                  },
                  {
                    key: 'T2',
                    value: 'B',
                    data: null,
                  },
                  {
                    key: 'T3',
                    value: 'C',
                    data: null,
                  },
                  {
                    key: 'T4',
                    value: 'D',
                    data: null,
                  },
                  {
                    key: 'T5',
                    value: 'E',
                    data: null,
                  },
                ],
              },
              trigger: {
                key: 'OnChange',
                value: '内容改变时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请选择考核等级',
                },
              ],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 12,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'examine_level_radio',
            label: '考核等级Radio',
            desc: '',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'Radio',
                value: 'radio-group',
              },
              attribute: {
                placeholder: '请选择考核等级',
                disable: null,
                visible: null,
                maxlength: null,
              },
              parameter: {},
              default: null,
              data_source: {
                type: {
                  key: 'Enum',
                  value: '枚举类型列表',
                },
                enum: [
                  {
                    key: 'T1',
                    value: 'A',
                    data: null,
                  },
                  {
                    key: 'T2',
                    value: 'B',
                    data: null,
                  },
                  {
                    key: 'T3',
                    value: 'C',
                    data: null,
                  },
                  {
                    key: 'T4',
                    value: 'D',
                    data: null,
                  },
                  {
                    key: 'T5',
                    value: 'E',
                    data: null,
                  },
                ],
              },
              trigger: {
                key: 'OnChange',
                value: '内容改变时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请选择考核等级',
                },
              ],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 12,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'examine_level_checkbox',
            label: '考核等级Radio',
            desc: '',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'Checkbox',
                value: 'Checkbox',
              },
              attribute: {
                placeholder: '请选择考核等级',
                disable: null,
                visible: null,
                maxlength: 2,
              },
              parameter: {},
              default: null,
              data_source: {
                type: {
                  key: 'Enum',
                  value: '枚举类型列表',
                },
                enum: [
                  {
                    key: 'T1',
                    value: 'A',
                    data: null,
                  },
                  {
                    key: 'T2',
                    value: 'B',
                    data: null,
                  },
                  {
                    key: 'T3',
                    value: 'C',
                    data: null,
                  },
                  {
                    key: 'T4',
                    value: 'D',
                    data: null,
                  },
                  {
                    key: 'T5',
                    value: 'E',
                    data: null,
                  },
                ],
              },
              trigger: {
                key: 'OnChange',
                value: '内容改变时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请选择考核等级',
                },
              ],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 12,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'examine_progress',
            label: '考核进度',
            desc: '',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'Input',
                value: 'input',
              },
              attribute: {
                placeholder: '请填写考核进度',
                disable: null,
                visible: null,
                maxlength: 32,
              },
              parameter: {},
              default: null,
              data_source: null,
              trigger: {
                key: 'OnBlur',
                value: '组件失焦时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请填写考核进度',
                },
              ],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 12,
                  column_length: 12,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'remark',
            label: '备注',
            desc: '',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'InputTextarea',
                value: 'input-textarea',
              },
              attribute: {
                placeholder: '请填写备注',
                disable: null,
                visible: null,
                maxlength: 10240,
              },
              parameter: {},
              default: null,
              data_source: null,
              trigger: {
                key: 'OnBlur',
                value: '组件失焦时',
              },
              has_other_input: null,
              validation: [],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'thesis_pdf',
            label: 'Link',
            desc: '',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'Upload',
                value: 'upload',
              },
              attribute: {
                placeholder: '请选择论文原文',
                disable: null,
                visible: null,
                maxlength: null,
              },
              parameter: {},
              default: null,
              data_source: null,
              trigger: {
                key: 'OnChange',
                value: '内容改变时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请选择论文原文',
                },
              ],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 1,
            is_active: 1,
          },
          {
            key: 'citation_cn',
            label: 'Citation_cn',
            desc: '',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'Input',
                value: 'input',
              },
              attribute: {
                placeholder: null,
                disable: 1,
                visible: null,
                maxlength: null,
              },
              parameter: {},
              default: null,
              data_source: null,
              trigger: {
                key: 'NoValidate',
                value: '无校验',
              },
              has_other_input: null,
              validation: [],
              linkages: [
                {
                  type: {
                    key: 'Value',
                    value: '控件值',
                  },
                  target: 'author',
                  condition: '',
                  schema: {
                    value: "{{ citation_cn('author', 'project_name', 'year') }}",
                  },
                  otherwise: {},
                },
                {
                  type: {
                    key: 'Value',
                    value: '控件值',
                  },
                  target: 'project_name',
                  condition: '',
                  schema: {
                    value: "{{ citation_cn('author', 'project_name', 'year') }}",
                  },
                  otherwise: {},
                },
                {
                  type: {
                    key: 'Value',
                    value: '控件值',
                  },
                  target: 'year',
                  condition: '',
                  schema: {
                    value: "{{ citation_cn('author', 'project_name', 'year') }}",
                  },
                  otherwise: {},
                },
              ],
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'citation_en',
            label: 'Citation_en',
            desc: '',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'Input',
                value: 'input',
              },
              attribute: {
                placeholder: null,
                disable: 1,
                visible: null,
                maxlength: null,
              },
              parameter: {},
              default: null,
              data_source: null,
              trigger: {
                key: 'NoValidate',
                value: '无校验',
              },
              has_other_input: null,
              validation: [],
              linkages: [
                {
                  type: {
                    key: 'Value',
                    value: '控件值',
                  },
                  target: 'author',
                  condition: '',
                  schema: {
                    value: "{{ obj('project_name').value+obj('author').value+obj('year').value }}",
                  },
                  otherwise: {},
                },
                {
                  type: {
                    key: 'Value',
                    value: '控件值',
                  },
                  target: 'project_name',
                  condition: '',
                  schema: {
                    value: "{{ obj('project_name').value+obj('author').value+obj('year').value }}",
                  },
                  otherwise: {},
                },
                {
                  type: {
                    key: 'Value',
                    value: '控件值',
                  },
                  target: 'year',
                  condition: '',
                  schema: {
                    value: "{{ obj('project_name').value+obj('author').value+obj('year').value }}",
                  },
                  otherwise: {},
                },
              ],
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'cascader',
            label: '级联Cascader',
            desc: '',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'Cascader',
                value: 'cascader',
              },
              attribute: null,
              parameter: {},
              default: null,
              data_source: null,
              trigger: {
                key: 'NoValidate',
                value: '无校验',
              },
              has_other_input: null,
              validation: [],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
          {
            key: 'project_center',
            label: '所属中心',
            desc: '若有中心参与研究，请填写中心全称（不写研究院名称），多个中心用英文半角分号隔开',
            type: {
              key: 'String',
              value: '文本',
            },
            multiple: 0,
            default: null,
            components: null,
            component: {
              key: null,
              type: {
                key: 'Select',
                value: 'select',
              },
              attribute: {
                placeholder: '请填写所属中心',
                disable: null,
                visible: null,
                maxlength: 20,
              },
              parameter: {},
              default: null,
              data_source: {
                type: {
                  key: 'Resource',
                  value: '资源类型配置',
                },
                value: 'team_parent_enum',
              },
              trigger: {
                key: 'OnChange',
                value: '内容改变时',
              },
              has_other_input: null,
              validation: [
                {
                  type: {
                    key: 'Required',
                    value: '非空',
                  },
                  value: 1,
                  min: null,
                  max: null,
                  len: null,
                  message: '请填写所属中心',
                },
              ],
              linkages: null,
              formatter: {},
              scene_layout: {
                save: {
                  column_begin: 0,
                  column_length: 24,
                  column_max: 24,
                },
                show: {
                  column: 1,
                },
              },
              skip: null,
            },
            link_to_subject: 0,
            duplicate_check: 0,
            is_active: 1,
          },
        ],
        version: '202103',
      },
      version: '202103',
      status: {
        key: 'Audit',
        value: '统计中',
      },
      order: 1,
      remark: '',
      created_by: '管理员',
      created_at: 1615802329,
      modified_by: '管理员',
      modified_at: 1615802329,
    },
  },
};
export default data;
