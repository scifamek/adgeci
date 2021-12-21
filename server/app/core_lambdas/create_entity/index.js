async function useCase(
  <<SIGNATURE>>
  enviroment,
  body
) {

  const response = await entitiesRepository.createEntityByType(body.collection,body.entity,enviroment);
  return response;
}
