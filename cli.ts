import {cli, command, got, Option} from './index';

cli({
    pkg: require('./package'),
    command: command({
        options: {
            force: Option.Boolean('--force')
        },
        async execute() {
            this.context.stdout.write(`Forced? ${ this.force }\n`);
            const result = await got.get('https://example.com');
            this.context.stdout.write(`${result.body.slice(0, 100)}\n`);
        }
    })
});
