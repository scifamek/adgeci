async function useCase(
  <<SIGNATURE>>
  enviroment,
  body
) {

  const entities = await entitiesRepository.getEntitiesByType(body.collection,body.page,body.sizePage,enviroment);
  return entities;
}

