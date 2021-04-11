async function useCase(
  <<SIGNATURE>>
  enviroment,
  body
) {
  const response = await schemasRepository.getSchemasTypeEntity(enviroment);
  return response;
}
