import { Config } from 'remotion';
import { resolve } from 'path';

Config.Rendering.setImageFormat('png');

Config.Bundling.overrideWebpackConfig((currentConfiguration) => {
    return {
        ...currentConfiguration,
        resolve: {
            ...currentConfiguration.resolve,
            alias: {
                ...currentConfiguration.resolve.alias,
                '@': resolve(process.cwd(), 'src/'),
            },
        },
    };
});
