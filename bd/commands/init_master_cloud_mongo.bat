@echo off
SET name_project=zonata
set command_connect=mongo "mongodb+srv://"zonata"-7udjk.mongodb.net/"%name_project% --username pochecho --password sifamek666 --eval "printjson(db.dropDatabase())
%command_connect%

for /F "Tokens=* delims=\\."  %%a in ('dir ..\\data /s /b *.json') do (
  echo %%b
  REM echo %h%
      REM mongoimport --uri "mongodb+srv://pochecho:sifamek666@zonata-7udjk.mongodb.net/zonata" --collection  %%h --drop --jsonArray --file ..\\data\\%%h.%%i
)


REM SET collections=(access,companies,default_components,end_points, groups,   profiles_end_points,profiles, projects, tokens_default, users)


REM FOR %%i in (access,companies,menus,architectures,default_components, roles, roles_end_points,
REM end_points, groups,   profiles_end_points,profiles, projects, tokens_default, users) do ( 
REM     echo %%i
REM     mongoimport --jsonArray --db %name_project% --collection %%i --file data\%%i.json
REM )

