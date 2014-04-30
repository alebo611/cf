<!-- File: /app/View/Posts/edit.ctp -->

<h1>Edit stock amound</h1>
<h1><?php echo h($shoe['Shoe']['name']); ?></h1>
<p>color: <?php echo $shoe['Shoe']['color']; ?></p>
<p>size: <?php echo $shoe['Shoe']['size']; ?></p>
<?php
echo $this->Form->create('Shoe');
echo $this->Form->input('id', array('type' => 'hidden'));
echo $this->Form->input('in_stock');
echo $this->Form->end('Save Post');
?>
