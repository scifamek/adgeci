async function useCase(
  <<SIGNATURE>>
  enviroment,
  body
) {
  let response = [];

  const adquiredModules = await modulesRepository.getModules(enviroment);
  for (const mod of adquiredModules) {
    const moduleInside = await $modulesRepository.getModuleById(mod['module_id'],enviroment);
    response.push({
      module:moduleInside,
      custom_name:mod['custom_name']
    });
  }

  return response;
}
