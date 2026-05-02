/** CJS shim for until-async (ESM-only package) — same behavior as upstream. */
async function until(callback) {
  try {
    return [
      null,
      await callback().catch((error) => {
        throw error
      }),
    ]
  } catch (error) {
    return [error, null]
  }
}

module.exports = { until }
