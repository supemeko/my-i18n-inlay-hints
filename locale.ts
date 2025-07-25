export async function getWatchFile(paths: string[]) {
  const locale = {
    data: {},
  };

  try {
    const response = await Promise.all(paths.map(path => Deno.readTextFile(path)));
    locale.data = Object.assign({}, ...response.map(str => JSON.parse(str)));
  } catch (_ignore) {
    // 什么都不做
  }

  const install = async () => {
    const watcher = Deno.watchFs(paths);

    let lastUpdate = 0;
    for await (const event of watcher) {
      if (event.kind === "modify") {
        let now = new Date().getTime();
        if (now - lastUpdate > 1000) {
          lastUpdate = now;
        }

        try {
          // locale.data = JSON.parse(await Deno.readTextFile(event.paths[0]));

          // for (const filePath of event.paths) {
          //   if (filePath.con || filePath.endsWith('zh.json')) {
          //     const zh = await loadLocaleFile('zh.json');
          //     locale.zh = mergeObjectsFromArray([zh, ...additionalTranslations]);
          //     console.log('Updated zh.json:', locale.zh);
          //   } else if (filePath.endsWith('en.json')) {
          //     locale.en = await loadLocaleFile('en.json');
          //     console.log('Updated en.json:', locale.en);
          //   }
          // }
          const response = await Promise.all(paths.map(path => Deno.readTextFile(path)));
          locale.data = Object.assign({}, ...response.map(str => JSON.parse(str)));
        } catch (_ignore) {
          // 什么都不做
        }
      }
    }
  }

  install()

  return function (str: string) {
    // deno-lint-ignore no-explicit-any
    return (locale.data as any)[str] || str;
  };
}
