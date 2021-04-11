name_project="zonata"
command_to_use="mongo ${name_project} --eval printjson(db.dropDatabase())"
echo $command_to_use
$command_to_use 
path_data="../data/"
for i in `ls ${path_data}`;
do
name_file=$(echo $i | cut -d'.' -f 1)
command_to_export="mongoimport --jsonArray --db ${name_project} --collection  ${name_file} --file ${path_data}${i}"
echo "$command_to_export"
$command_to_export
done