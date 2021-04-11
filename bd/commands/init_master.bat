@echo off
SET name_project=zonata

SET  command=mongo %name_project% --eval "printjson(db.dropDatabase())"
%command% 
SET collections=(access,companies,default_components,end_points, groups,   profiles_end_points,profiles, projects, tokens_default, users)


FOR %%i in (access,companies,menus,architectures,default_components, roles, roles_end_points,
end_points, groups,   profiles_end_points,profiles, projects, tokens_default, users) do ( 
    echo %%i
    mongoimport --jsonArray --db %name_project% --collection %%i --file data\%%i.json
)

