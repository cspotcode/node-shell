import { BaseContext, Builtins, Cli, Command, CommandClass, Usage } from 'clipanion';
import * as _ from 'lodash';
export {_};

export * as clipanion from 'clipanion';
export * as zx from '@cspotcode/zx';
export {Command, type Usage, Option} from 'clipanion';
export const DefaultPath = Command.Default;
export {$, cd, glob, globby, nothrow, question, sleep} from '@cspotcode/zx';
export * as t from 'typanion';
import { importGot } from './index-helper';

export let got: typeof import('got').default;
const loadGot = importGot().then(mod => {
    got = mod.default;
});

export interface EasyCliOptions {
    __filename?: string;
    pkg?: {name: string, version: string},
    name?: string;
    version?: string;
    definitionsCommand?: boolean;
    Command?: CommandClass<BaseContext>;
    command?: CommandClass<BaseContext>;
    commands?: Array<CommandClass<BaseContext>>;
}
export async function cli(options: EasyCliOptions) {
    const [node, app, ...args] = process.argv;
    const {name, version, pkg} = options;
    const _cli = new Cli({
        binaryLabel: name ?? pkg?.name,
        binaryName: name ?? pkg?.name,
        binaryVersion: version ?? pkg?.version,
    });
    if(options.command) _cli.register(options.command);
    if(options.Command) _cli.register(options.Command);
    if(options.commands) {
        for(const command of options?.commands) {
            _cli.register(command);
        }
    }
    _cli.register(Builtins.HelpCommand);
    _cli.register(Builtins.VersionCommand);
    if(options.definitionsCommand) _cli.register(Builtins.DefinitionsCommand);
    await loadGot;
    _cli.runExit(args);
    return _cli;
}

interface CommandOptions<Options> {
    path?: string[];
    paths?: Array<string[]>;
    options?: Options;
    usage?: Usage;
    execute?: (this: Options & Command) => Promise<number | void>;
}
export function command<Options>(options: CommandOptions<Options>) {
    class EzCommand extends Command {
        static paths = options.paths ?? (options.path ? [options.path] : [Command.Default]);
        static usage = options.usage;
        constructor() {
            super();
            Object.assign(this, options.options);
        }
        async execute() {
            await loadGot;
            return options.execute?.call(this as any);
        }
    }
    return EzCommand;
}