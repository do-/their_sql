module.exports = {

    label: 'История редактирования',

    columns: {
        _id      : 'text            // Ссылка на объект',
        _id_rq   : 'uuid            // Запрос',
        _id_user : 'uuid            // Пользователь',
        _type    : 'string          // Тип объекта, с которым производится действие',
        _action  : 'string          // Символическое имя действия',
        _ts      : 'timestamp=now() // Дата/время',
    },

    _triggers: {

        before_insert: function () {return `
        
        	SELECT 
        		_id_user 
        		, _type
        		, _action
        		, _id_rq
        	FROM 
        		json_to_record (current_setting ('their_sql.request')::json) AS t (
        			_id_user uuid
        			, _type    text
        			, _action  text
	        		, _id_rq   text
        		) 
        	INTO 
        		NEW._id_user
        		, NEW._type
        		, NEW._action
        		, NEW._id_rq
        	;
        	
        	NEW.uuid := uuid_generate_v4();

        	RETURN NEW;

        `},

    },

    add_to: function (table) {

    	let {model} = this; delete this.model
    	
    	let log_table = {
    	
    		...clone (this),

			name: table.name + '_versions',

			label: table.label + ' / история изменения',    	
			
			triggers: {},

    	}

		delete log_table._triggers; let {_triggers} = this; for (let n in _triggers) log_table.triggers [n] = _triggers [n].call (log_table)
    	
    	let columns       = log_table.columns
//    	columns._uuid.ref = table.name

    	let except_columns = ['id', ...(table.log.except_columns || [])]

    	let names = Object.keys (table.columns).filter (name => !except_columns.includes (name))

    	for (let name of names) {

    		let column = clone (table.columns [name])

			column.NULLABLE = true

			for (let k of ['COLUMN_DEF', 'MIN_LENGTH', 'MIN', 'MAX', 'PATTERN']) delete column [k]

			columns [name] = column

    	}

    	model.tables [log_table.name] = log_table; this.model = model

    	table.columns._uuid_version = {
			TYPE_NAME: 'uuid',
			name: '_uuid_version',
			ref: log_table.name,
			REMARK: 'Последняя версия',
    	}

    	if (!table.triggers) table.triggers = {}
    	
    	table.triggers.before_update_insert_delete = `
    	
    		DECLARE __action text;
    		
    		BEGIN
    	
				SELECT _action INTO __action FROM (
					SELECT 
						_id_user 
						, _type
						, _action
						, _id_rq
					FROM 
						json_to_record (current_setting ('their_sql.request')::json) AS t (
							_id_user uuid
							, _type    text
							, _action  text
							, _id_rq   text
						) 
				) t;
    	
			IF TG_OP = 'DELETE' THEN 
		        	
				INSERT INTO

					${log_table.name} (_id,${names})
					
				VALUES 
				
					(OLD.id,${names.map (name => 'OLD.' + name)});
					
        		RETURN OLD; 
		        		
        	ELSIF __action <> 'execute' AND ((TG_OP = 'INSERT') OR ${names

					.map (name => table.columns [name].TYPE_NAME == 'json' ? name + '::text' : name)

					.map (name => '(NEW.' + name + ' IS DISTINCT FROM OLD.' + name + ')')

        			.join (' OR ')

				}) THEN

				INSERT INTO

					${log_table.name} (_id,${names}) 

				VALUES

					(NEW.id,${names.map (name => 'NEW.' + name)})

				RETURNING uuid INTO 

					NEW._uuid_version;
		        		
				RETURN NEW;
				
			ELSE 

				RETURN NEW;

			END IF;

			END;
        
        `
    
    }

}