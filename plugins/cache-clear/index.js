module.exports = {
  async onPreBuild({ utils }) {
    console.log('Clearing build cache...')
    const files = await utils.cache.list()
    await Promise.all(files.map((file) => utils.cache.remove(file)))
    console.log(`Cleared ${files.length} cached files`)
  },
}
