declare type ModelBase = { [key: string]: any };
export enum SingleRuleValidate {
  Required = "Required",
  Regex = "Regex",
  RequiredValue = "RequiredValue",
  Array = "Array",
  Custom = "Custom",
}
const MessageDefault = {
  Required: "The {0} is required",
  Regex: "The {0} is not match {1}",
  RequiredValue: "the {0} is not equal {1}",
  Array: "The {0} is not valid",
  Custom: "Error Custom",
};
export interface IRuleOption {
  rule: SingleRuleValidate;
  message?: string;
  Value?:
    | RegExp
    | ((value: any, model: any) => boolean)
    | number
    | Array<any>
    | boolean;
}

export interface IConfigValue {
  Rules: IRuleOption[];
}

export type IConfig<TModel> = {
  [key in keyof Extract<TModel, ModelBase>]?: IConfigValue;
};
export type PartialError<TModel> = {
  [key in keyof Extract<TModel, ModelBase>]?: IRuleOption[];
};
export class FormValidator<TModel> {
  constructor(configs: IConfig<TModel>) {
    this.configs = configs;
  }
  configs: IConfig<TModel>;
  Required = (RuleOption: IRuleOption, value: any) => {
    return value === null || value === undefined || value === "";
  };
  Regex = (RuleOption: IRuleOption, value: string, Regex: RegExp) => {
    return !(RuleOption.Value as RegExp).test(value);
  };
  RequiredValue = (RuleOption: IRuleOption, value: any) => {
    return value !== RuleOption.Value;
  };
  Custom = (RuleOption: IRuleOption, value: any, model: any) => {
    if (typeof RuleOption.Value === "function") {
      return RuleOption.Value(value, model);
    }
    return true;
  };
  Array = (RuleOption: IRuleOption, value: any) => {
    if (typeof RuleOption.Value === "number") {
      return Array.isArray(value) ? value.length <= RuleOption.Value : true;
    }
    return true;
  };
  RenderMessage = (RuleOption: IRuleOption, key: string) => {
    if (!RuleOption.message) {
      RuleOption.message = MessageDefault[RuleOption.rule].replace("{0}", key);
      switch (RuleOption.rule) {
        case SingleRuleValidate.Regex: {
          RuleOption.message = RuleOption.message.replace(
            "{1}",
            (RuleOption.Value as RegExp).source
          );
          break;
        }
        case SingleRuleValidate.RequiredValue: {
          RuleOption.message = RuleOption.message.replace(
            "{1}",
            RuleOption.Value?.toString() ?? ""
          );
          break;
        }
        default:
          break;
      }
    }
    return RuleOption;
  };
  run = (model: TModel) => {
    const keys = Object.keys(this.configs);
    const data: PartialError<TModel> = {};
    keys.forEach((key) => {
      const config = this.configs[key];
      if (!config) return;
      const tmp = this.Executed(config, (model as any)[key], model);
      if (tmp.length < 1) return;
      (data as any)[key] = tmp.map((x) => this.RenderMessage(x, key));
    });
    return data;
  };
  Executed = (Config: IConfigValue, valueField: any, model: any) => {
    return Config.Rules.filter((Value) => {
      const action = (this as any)[Value.rule.toString()];
      return action && action(Value, valueField, model);
    });
  };
}
