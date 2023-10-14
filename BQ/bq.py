from google.cloud import bigquery
from google.cloud.exceptions import NotFound

def bq_create_dataset(bigquery_client, dataset_name):
    dataset_ref = bigquery_client.dataset(dataset_name)

    try:
        dataset = bigquery_client.get_dataset(dataset_ref)
        print('Dataset {} already exists.'.format(dataset))
    except NotFound:
        dataset_val = bigquery.Dataset(dataset_ref)
        dataset_val.location = 'US'
        dataset = bigquery_client.create_dataset(dataset_val)
        print('Dataset {} created.'.format(dataset.dataset_id))
    return dataset

def bq_create_table(bigquery_client, dataset_name, table_name):
    dataset_ref = bigquery_client.dataset(dataset_name)

    table_ref = dataset_ref.table(table_name)

    try:
        table = bigquery_client.get_table(table_ref)
        print("table {} already exists.".format(table))
    except NotFound:
        schema = [
            bigquery.SchemaField('S_No', 'INTEGER', mode="REQUIRED"),
            bigquery.SchemaField('Age_in_cm', 'INTEGER', mode='REQUIRED'),
            bigquery.SchemaField('Weight_in_Kg', 'INTEGER', mode='REQUIRED'),
            bigquery.SchemaField('Name', 'STRING', mode='REQUIRED'),
        ]
        table_val = bigquery.Table(table_ref, schema=schema)
        table = bigquery_client.create_table(table_val)
        print('table {} created.'.format(table.table_id))
    return table

def export_items_to_bigquery(bigquery_client, dataset_name, table_name):
    dataset_ref = bigquery_client.dataset(dataset_name)

    table_ref = dataset_ref.table(table_name)
    table = bigquery_client.get_table(table_ref)

    rows_to_insert = [
        (1, 32, 32, "Harry"),
        (2, 63, 29, "Ron"),
        (3, 108, 108, "Hermonie")
    ]
    errors = bigquery_client.insert_rows(table, rows_to_insert)
    assert errors == []




if __name__ == "__main__":
    bigquery_client = bigquery.Client()
    dataset_name = "demo_dataset"
    table_name = "demo_table"
    data = bq_create_dataset(bigquery_client, dataset_name)
    table = bq_create_table(bigquery_client, dataset_name, table_name)
    export_items_to_bigquery(bigquery_client, dataset_name, table_name)