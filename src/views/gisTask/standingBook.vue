<template>
  <div
    class="wrapper"
    v-loading="loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.3)"
  >
    <div class="filters">
      <el-form ref="queryForm" :inline="true">
        <el-form-item>
          <el-select
            @change="handleQuery"
            v-model="actionName"
            placeholder="请选择类别"
          >
            <el-option
              v-for="(action, key) in actions"
              :key="key"
              :label="key"
              :value="key"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="action" v-if="action">
      <div class="target" v-if="action.target">
        <el-divider content-position="left">攻坚目标</el-divider>
        {{ action.target }}
      </div>
      <div class="tasks" v-if="action.task">
        <el-divider content-position="left">攻坚任务</el-divider>
        <box1 v-for="(task, index) in action.task" :key="index">
          <div class="task">
            <div class="content">{{ task.content }}</div>

            <div class="details">
              <div class="target" v-if="task.target">
                <div class="title">
                  任务目标
                </div>
                <div v-html="task.target"></div>
              </div>
              <div class="requirement" v-if="task.requirement">
                <div class="title">
                  工作要求
                </div>
                <div v-html="task.requirement"></div>
              </div>
              <div class="result" v-if="task.result">
                <div class="title">
                  工作结果
                </div>
                <div class="content">
                  <div
                    class="year"
                    v-for="(year, key) in task.result"
                    :key="key"
                  >
                    <div class="date">{{ key }}</div>
                    <div class="content">
                      <div>
                        <div
                          class="name"
                          style="
                border-right: 1px solid #89bbf7;"
                        >
                          工作任务
                        </div>
                        {{ year.task }}
                      </div>
                      <div>
                        <div class="name">阶段性成果要求</div>
                        {{ year.requirement }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </box1>
      </div>
    </div>
  </div>
</template>

<script>
import Box1 from '@/views/components/box1'
const actions = {
  入海排污口排查整治行动: {
    task: [
      {
        content: `参照渤海入海排污口排查经验，按照“有口皆查，应查尽查”要求，全面推进长江口-杭州湾、珠江口邻近海域入海排污口排查，建立“一口一档”的入海排污口动态台账。`,
        requirement: `1.长江口-杭州湾、珠江口邻近海域相关沿海地方按照入海排污口排查有关要求，全面开展入海排污口排查，跟踪评估进展及成效。<br >
        2.2023年底前完成长江口-杭州湾、珠江口邻近海域入海排污口排查，并提交排查成果。
        3.根据流域海域局核查反馈意见进行完善。<br>
        4.建立“一口一档”的入海排污口动态台账，详细记录入海排污口有关信息。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `制定入海排污口溯源整治方案，进一步清理非法和设置不合理入海排污口，加强沿岸直排海污染源整治，对未稳定达标排放的入海排污口进行深度治理，“一口一策”持续推进三大重点海域入海排污口溯源整治。`,
        requirement: `1.根据排查情况和入海排污口溯源整治有关要求，制定溯源整治方案，明确责任主体，并“一口一策”持续推进入海排污口溯源整治，对非法和设置不合理的入海排污口进行清理。<br>
        2.根据每季度开展的近岸海域生态环境形势会商预警情况，对未达标排放的直排海污染源和入海排污口进行深度治理。
`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `建立健全入海排污口备案、监测、监管等制度`,
        requirement: `1.根据排查整治、审核备案、日常监管等信息，持续完善入海排污口动态管理台账。<br>2.根据有关要求，将入海排污口相关信息及时报送流域海域局并纳入国家生态环境综合管理信息化平台。<br>3.根据有关要求，统筹制定入海排污口监测监管等制度和政策措施，并做好日常监督管理，根据流域海域局监督检查通报的问题及时整改。 `,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      }
    ],
    target: `2023年底前，长江口-杭州湾、珠江口邻近海域完成入海排污口排查，制定溯源整治方案。到2025年，渤海基本完成入海排污口清理整治，三大重点海域基本实现入海排污口分类监管全覆盖。`
  },
  入海河流水质改善行动: {
    task: [
      {
        content: `加强陆海统筹和区域协同，深化海河、辽河、淮河、珠江等重点流域综合治理，完善水污染防治流域协同机制。`,
        requirement: `各地结合工作实际，明确加强陆海统筹和区域协同，以及流域综合治理的具体措施，积极探索实践上下游、左右岸、跨行政区氮磷等污染物联防联控机制。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `加强沿海城市重污染海湾入海河流整治，组织制定“一河一策”入海河流治理方案。因地制宜加强总氮排放控制，实施入海河流总氮削减工程。`,
        requirement: `1.各地按照有关技术要求，制定“一河一策”治理方案，明确主要入海河流水质改善和总氮削减的具体措施，并推进有关措施落地见效。<br>
        2.根据每季度开展的近岸海域生态环境形势会商预警情况，对水质未达标或总氮浓度反弹的入海河流进行深度整治。<br>
        3.定期分析入海河流及近岸海域水质变化情况，评估治理效果，及时优化调整措施。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      }
    ],
    target: `到2025年，省控及以上河流入海断面基本消除劣V类，沿海城市行政区域内国控河流入海断面总氮浓度与2020年相比保持负增长。`
  },
  沿海城市污染治理行动: {
    task: [
      {
        content: `加强沿海城市固定污染源总氮排放控制和监管执法，全面推行排污许可“一证式”管理，实行依法持证排污、按证排污、依证监管。`,
        target: '持续推进',
        requirement: `1.各地摸清本地区涉氮行业固定污染源底数，建立涉氮固定污染源清单，明确加强固定污染源总氮排放控制和监管执法的具体措施。<br>
        2.按照有关要求，持续推行排污许可“一证式”管理，跟踪评估涉氮固定污染源排污许可制度执行、总氮排放控制、监管执法开展等工作成效，发现问题及时采取措施。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `推进沿海城镇污水管网全覆盖，大力推进城中村、老旧城区、城乡结合部污水管网建设与改造。开展城镇雨污管网混错接改造、更新、破损修复，加强管网清疏管养，进一步提高污水收集效能，因地制宜实施雨污分流改造。推进污水处理设施高质量建设和运维。`,
        target:
          '到2025年，沿海城市生活污水集中收集率达到70%以上，县城污水处理率达到95%以上。',
        requirement: `1.各地结合工作实际，细化沿海城镇雨污管网建设、改造、养护等相关工程措施，明确污水处理设施高质量建设和运维的具体要求，并有序推进工程措施落地见效。<br>
        2.定期评估沿海城市生活污水集中收集率、县城污水处理率、工程项目进展成效等，及时优化调整措施。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      }
    ]
  },
  沿海农业农村污染治理行动: {
    task: [
      {
        content: `因地制宜推进沿海地区农业面源污染防治。深入推进化肥农药减量增效，实施农膜回收行动，推动畜禽粪污资源化利用，推进种养结合。`,
        target:
          '到2025年，沿海地市主要农作物化肥农药使用量持续减少，利用率均达到43%，畜禽规模养殖场粪污处理设施装备配套率稳定在97%以上。',
        requirement: `各地结合工作实际，细化化肥农药减量增效、农膜回收、畜禽粪污资源化利用、种养结合以及其他农业面源污染防治的具体措施，定期评估成效，及时优化调整措施。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `因地制宜推进沿海地区农村人居环境整治提升。加强农村环境保护基础设施建设，提升农村生活垃圾和污水治理水平。`,
        target: '持续推进',
        requirement: `各地结合工作实际，明确加强农村环境保护基础设施建设、提升农村生活垃圾和污水治理水平等推进沿海地区农村人居环境整治提升的具体措施，定期评估进展及成效。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      }
    ]
  },
  海水养殖环境整治行动: {
    task: [
      {
        content: `沿海地方严格落实养殖水域滩涂规划和生态保护红线等管控要求，进一步优化海水养殖空间布局，依法禁止在禁养区开展海水养殖活动。`,
        target: '持续推进',
        requirement: `根据有关要求，摸清本地区海水养殖分布、规模、类型等基本情况，及未依法依规开展环境影响评价的海水养殖项目底数，制定整改方案并逐步依法推动解决；明确海水养殖空间布局优化、禁养区海水养殖活动清理等具体措施，定期评估进展及成效。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `研究制订海水养殖污染防控方案，推进海水养殖环保设施升级改造。`,
        target: '持续推进',
        requirement: `各地结合工作实际，制订海水养殖污染防控方案，细化推进海水养殖环保设施升级改造。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `按照有关部署，研究制订海水养殖尾水排放相关地方标准，加强工厂化养殖尾水排放监测，加大海水养殖对海洋生态环境影响的监视监管力度。`,
        target: '2023年底前，沿海省（市）出台地方海水养殖尾水相关排放标准。',
        requirement: `各地结合工作实际，研究制订地方海水养殖尾水相关排放标准，明确推进养殖尾水排放监测和监视监管的具体措施，定期评估进展及成效。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      }
    ]
  },
  船舶港口污染防治行动: {
    task: [
      {
        content: `沿海地方各相关部门按照职责分工，进一步巩固船舶和港口污染治理成果，完善实施船舶水污染物转移处置联单制度，推进“船-港-城”全过程协同管理。`,
        target: '持续推进',
        requirement: `厘清各相关部门职责分工，完善实施船舶水污染物转移处置联单制度，明确推进“船-港-城”全过程协同管理的具体措施，定期评估成效，及时优化调整措施。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `研究制订海水巩固深化渤海渔港环境整治成果，将长江口-杭州湾、珠江口邻近海域主要渔港纳入名录管理。养殖污染防控方案，推进海水养殖环保设施升级改造。`,
        target: '持续推进',
        requirement: `1.渤海区域沿海地方结合工作实际，推进已纳入名录管理的渔港进一步开展环境整治工作。<br>
        2.摸清长江口-杭州湾、珠江口邻近海域渔港底数，根据有文件要求，推进将主要渔港纳入名录管理。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `进一步规范各级渔港、渔船停泊点生产生活污水和渔业垃圾回收处置，推进污染防治设施设备建设和环境清理整治。`,
        target: '持续推进',
        requirement: `摸清各级渔港、渔船停泊点基本信息及废水垃圾回收处置方法、污染防治设施设备等情况，细化渔港污染防治设施建设、环境清理整治等的具体措施，有序推进落实。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      }
    ]
  },
  岸滩环境整治行动: {
    task: [
      {
        content: `加强岸滩及海面漂浮垃圾的监测调查。`,
        target: '持续推进',
        requirement: `各地结合工作实际，明确岸滩及海面漂浮垃圾的监测调查的具体任务安排，并有序推进落实。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `进一步推动沿海市县建立海洋垃圾清理工作长效机制，保持亲海岸滩等重点滨海区域无明显塑料垃圾。`,
        target: '持续推进',
        requirement: `各地结合工作实际，细化海洋垃圾清理工作的部门分工、工作流程和协作机制等，明确应重点关注的亲海岸滩等重点滨海区域，并推进相关区域海洋垃圾清理工作机制常态化运行，定期评估成效，及时优化调整措施。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `增加海滩等活动场所垃圾收集设施投放，提高垃圾清运频次。`,
        target: '持续推进',
        requirement: `各地结合工作实际，明确海滩等活动场所垃圾收集设施投放的地点、数量及清运频次等，定期评估成效。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `开展海水浴场、滨海旅游度假区周边入海污染源排查整治。加强海水浴场环境质量监测预报和信息发布。`,
        target: '持续推进',
        requirement: `1.摸清本地区海水浴场、滨海旅游度假区名称、位置、周边环境等情况，明确开展海水浴场、滨海旅游度假区周边入海污染源排查整治的具体安排，并有序推进落实。<br>
        2.各地结合工作实际，明确本地区海水浴场环境质量监测预报的时间、频次、指标等，并及时发布相关信息。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      }
    ]
  },
  海洋生态保护修复行动: {
    task: [
      {
        content: `巩固深化渤海生态保护修复成效，因地制宜实施黄河口、辽河口、滦河口等河口湿地保护修复，不断提升渤海生态系统质量；推进长江口-杭州湾、珠江口邻近海域滨海湿地和岸线保护修复。`,
        target: '持续推进',
        requirement: `各地结合工作实际，细化相关工程措施，列出重点工程项目清单，并有序推进落实落地，定期评估工程项目进展成效，发现问题及时调整优化。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `渤海继续加强斑海豹、黑嘴鸥等珍贵濒危物种及其栖息地保护。长江口-杭州湾实施中华鲟、白头鹤等濒危物种及其关键栖息地的保护修复和生态监管，加强鳗苗等具有重要经济价值的水产苗种捕捞特许管理。珠江口邻近海域系统实施滨海水鸟栖息地生境营造提升建设，加强中华白海豚保护能力与救护网络建设及人类活动监管，恢复修复重要洄游通道。`,
        target: '持续推进',
        requirement: `各地结合工作实际，细化相关工程措施，列出重点工程项目清单，并有序推进落实落地，定期评估工程项目进展成效，发现问题及时调整优化。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `严格海洋伏季休渔监管执法，实施现代化海洋牧场建设，开展渔业资源增殖放流，清理取缔涉渔“三无”船舶。`,
        target: '持续推进',
        requirement: `明确海洋伏季休渔监管执法，实施现代化海洋牧场建设，开展渔业资源增殖放流，清理取缔涉渔“三无”船舶等的具体安排，定期评估成效。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `开展海水浴场、滨海旅游度假区周边入海污染源排查整治。加强海水浴场环境质量监测预报和信息发布。`,
        target: '持续推进',
        requirement: `1.摸清本地区海水浴场、滨海旅游度假区名称、位置、周边环境等情况，明确开展海水浴场、滨海旅游度假区周边入海污染源排查整治的具体安排，并有序推进落实。<br>
        2.各地结合工作实际，明确本地区海水浴场环境质量监测预报的时间、频次、指标等，并及时发布相关信息。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      }
    ]
  },
  加强海洋环境风险防范和应急监管能力建设: {
    task: [
      {
        content: `沿海地方加强沿岸原油码头、危化品运输、重点航线等环境风险隐患排查，强化事前预防和源头监管。建立健全海上溢油监测体系，提升风险早期识别和预报预警能力。`,
        target: '持续推进',
        requirement: `各地结合工作实际，细化沿海地方环境风险隐患排查的具体安排，明确强化事前预防和源头监管、建立健全海上溢油监测体系，以及提升风险早期识别和预报预警能力的具体措施，定期评估进展成效。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `加强重点海域沿岸石化集聚区等涉海环境风险源排查，督促相关企业开展环境风险隐患整治，加强执法监督，依法查处环境违法行为。以渤海为重点，加强海洋石油勘探开发环境风险源排查整治和溢油风险监控。`,
        target: '持续推进',
        requirement: `1.各地结合工作实际，明确涉海环境风险源排查、执法监督等的具体安排和隐患整治的具体要求，并推进落实，定期评估进展成效。<br>
        2.摸清本地区海洋石油勘探开发基本情况，并明确加强环境风险源排查整治和溢油风险监控的具体措施，定期评估进展成效。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      },
      {
        content: `指导督促沿海省（市）有关部门和相关企业等加强海洋突发环境事件应急预案制修订，推进沿海地方应急船舶装备、物资保障、监测预警预报、监督执法等能力建设。`,
        target:
          '到2025年，沿海省（市）各配备至少1艘300吨级以上海洋环境监测应急船舶。',
        requirement: `沿海省（市）有关部门和相关企业等按照有关要求，及时修订海洋突发环境事件应急预案制，明确推进应急船舶装备、物资保障、监测预警预报、监督执法等能力建设应急能力建设的具体安排，定期评估成效。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      }
    ]
  },
  推进美丽海湾建设: {
    task: [
      {
        content: `按照沿海地方统一部署，围绕“水清滩净、鱼鸥翔集、人海和谐”的美丽海湾目标要求，保护好自然禀赋优良的海湾生态环境，加强受损海湾“一湾一策”综合治理，因地制宜推进重点海域的美丽海湾建设，加强海湾生态环境常态化监测监管。`,
        target: '到2025年，形成一批具有全国示范价值的美丽海湾。',
        requirement: `按照本地区统一部署，明确美丽海湾保护与建设的具体任务措施和时间安排，“一湾一策”开展受损海湾综合治理，常态化开展海湾生态环境监测监管，定期评估进展成效，及时优化调整措施。`,
        result: {
          2022: {
            task: '',
            requirement: ''
          },
          2023: {
            task: '',
            requirement: ''
          }
        }
      }
    ]
  }
}
export default {
  components: { Box1 },
  data() {
    return {
      actionName: '入海排污口排查整治行动',
      actions,
      action: {},
      loading: false
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.handleQuery()
  },
  beforeDestroy() {},
  methods: {
    handleQuery() {
      this.loading = true

      setTimeout(() => {
        this.loading = false
        this.action = this.actions[this.actionName]
      }, 1500)
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'even-row-style'
      }
      return 'odd-row-style'
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 10px;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 2000;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(179deg, #001a3ed9 64%, #001a3e 96%);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  .action {
    color: white;
    overflow: auto;
    .target {
      font-size: 14px;
    }
    .tasks {
      .task {
        > .content {
          padding: 5px 10px;
          font-size: 14px;
          color: orange;
        }
        .details {
          display: flex;
          flex-direction: row;
          .target {
            width: 300px;
            padding: 10px;
          }
          .requirement {
            width: 300px;
            padding: 10px;
          }
          .result {
            flex-grow: 1;
            > .content {
              border: 1px solid #89bbf7;
              display: flex;
              flex-direction: row;
              height: 90%;
              .year {
                border-right: 1px solid #89bbf7;
                flex-grow: 1;
                &:last-child {
                  border-right: none;
                }
                .date {
                  text-align: center;
                  padding: 2px;
                  border-bottom: 1px solid #89bbf7;
                }
                .content {
                  display: flex;
                  flex-direction: row;
                  > div {
                    flex-grow: 1;
                  }
                  .name {
                    text-align: center;
                    padding: 2px;
                    border-bottom: 1px solid #89bbf7;
                  }
                }
              }
            }
          }
          .title {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
